"use server";

// PIN lock — 4-6 digit code stored hashed on the User row. Used as a
// quick re-entry gate when the app is opened on a shared device.
//
// Storage: scrypt hash with per-user random salt (no plaintext anywhere).
// We use Node's built-in crypto to avoid pulling bcrypt as a dep.
//
// Threat model:
//   - Casual snooping by a family member who borrows the phone — PIN stops them.
//   - NOT meant to defend against a determined attacker with the DB dump.
//     (For that, the real password / OTP path is the gate.)

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keyLen: number,
) => Promise<Buffer>;

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
// Stored format: "scrypt$<saltHex>$<hashHex>"
const FORMAT_TAG = "scrypt";

async function hashPin(pin: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const buf = await scrypt(pin, salt, SCRYPT_KEYLEN);
  return `${FORMAT_TAG}$${salt.toString("hex")}$${buf.toString("hex")}`;
}

async function verifyHash(pin: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== FORMAT_TAG) return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = await scrypt(pin, salt, SCRYPT_KEYLEN);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function requireUserId(): Promise<string> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  return s.user.id;
}

function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

// Reject obviously weak PINs (1234, 0000, 1111, etc.)
function isWeakPin(pin: string): boolean {
  if (/^(\d)\1+$/.test(pin)) return true;          // all same digit
  if ("0123456789".includes(pin)) return true;     // sequential ascending
  if ("9876543210".includes(pin)) return true;     // sequential descending
  return false;
}

export async function setPin(input: { pin: string; confirmPin: string }) {
  const userId = await requireUserId();
  const { pin, confirmPin } = input;
  if (!isValidPin(pin)) {
    return { ok: false as const, reason: "INVALID", message: "PIN must be 4-6 digits." };
  }
  if (pin !== confirmPin) {
    return { ok: false as const, reason: "MISMATCH", message: "PINs don't match. Try again." };
  }
  if (isWeakPin(pin)) {
    return {
      ok: false as const,
      reason: "WEAK",
      message: "Try a less guessable PIN. Avoid 0000, 1234, 1111, etc.",
    };
  }
  const pinHash = await hashPin(pin);
  await prisma.user.update({
    where: { id: userId },
    data: { pinHash, pinSetAt: new Date() },
  });
  return { ok: true as const };
}

export async function verifyPin(input: { pin: string }) {
  const userId = await requireUserId();
  const { pin } = input;
  if (!isValidPin(pin)) {
    return { ok: false as const, reason: "INVALID" };
  }
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { pinHash: true },
  });
  if (!u?.pinHash) {
    return { ok: false as const, reason: "NOT_SET" };
  }
  const match = await verifyHash(pin, u.pinHash);
  return match ? { ok: true as const } : { ok: false as const, reason: "WRONG" };
}

export async function removePin() {
  const userId = await requireUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { pinHash: null, pinSetAt: null },
  });
  return { ok: true as const };
}

/** Does the current user have a PIN set? */
export async function hasPin(): Promise<boolean> {
  const userId = await requireUserId();
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { pinHash: true },
  });
  return Boolean(u?.pinHash);
}
