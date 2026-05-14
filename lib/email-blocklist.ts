// Disposable / throwaway email domain blocklist.
//
// Cheap first-line defence against signup fraud — these are the addresses
// people use when they don't want a real account (mailinator, guerrilla
// mail, etc.). Real verification (the link we send) is the second line.
//
// Not exhaustive — the full Reddit list of disposable providers runs to
// 100k+ entries. We block the most-used 60+ and trust verification for
// everything else.

const DISPOSABLE_DOMAINS = new Set([
  "0-mail.com", "10minutemail.com", "10minutemail.net", "20minutemail.com",
  "33mail.com", "anonbox.net", "burnermail.io", "byom.de", "cool.fr.nf",
  "courriel.fr.nf", "deadaddress.com", "discard.email", "discardmail.com",
  "disposableinbox.com", "dispostable.com", "drdrb.net", "easytrashmail.com",
  "email-fake.com", "emailondeck.com", "emailtemporanea.net", "fake-mail.fr",
  "fakeinbox.com", "fakemail.fr", "fakemailgenerator.com", "fakeinbox.net",
  "fakermail.com", "filzmail.com", "freemailservices.com", "gawab.com",
  "getairmail.com", "getmails.eu", "getnada.com", "ghosttexting.com",
  "guerrillamail.biz", "guerrillamail.com", "guerrillamail.de",
  "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "harakirimail.com", "hidemail.de", "hmamail.com", "incognitomail.com",
  "incognitomail.net", "incognitomail.org", "inboxalias.com", "inboxbear.com",
  "jetable.fr.nf", "jetable.net", "jetable.org", "jourrapide.com",
  "kasmail.com", "kurzepost.de", "lifebyfood.com", "link2mail.net",
  "mail-temporaire.fr", "mail.tm", "mailcatch.com", "maildrop.cc",
  "mailexpire.com", "mailforspam.com", "mailgw.com", "mailimate.com",
  "mailinator.com", "mailinator.net", "mailinator.org", "mailinator2.com",
  "mailmoat.com", "mailnesia.com", "mailnull.com", "mailtrash.net",
  "moakt.com", "monumentmail.com", "msft.com", "mt2009.com",
  "mvrht.com", "mytemp.email", "nada.email", "nada.ltd", "no-spam.ws",
  "nobulk.com", "noclickemail.com", "nospam.ze.tc", "nospamfor.us",
  "objectmail.com", "obobbo.com", "odaymail.com", "one-time.email",
  "onetimeemail.net", "owlpic.com", "pookmail.com", "privacy.net",
  "quickinbox.com", "rmqkr.net", "rppkn.com", "sharklasers.com",
  "shitmail.me", "shitmail.org", "shortmail.net", "sneakemail.com",
  "spam.la", "spam4.me", "spambog.com", "spambox.us", "spamcero.com",
  "spamdecoy.net", "spamex.com", "spamfree24.com", "spamfree24.de",
  "spamfree24.eu", "spamfree24.info", "spamfree24.net", "spamfree24.org",
  "spamgourmet.com", "spamgourmet.net", "spamhereplease.com",
  "spaml.com", "spaml.de", "spammotel.com", "spamspot.com",
  "spamthis.co.uk", "spamtrail.com", "supermailer.jp", "tempail.com",
  "temp-mail.org", "temp-mail.ru", "tempemail.co", "tempemail.com",
  "tempinbox.com", "tempmail.com", "tempmail.email", "tempmail.it",
  "tempmail.net", "tempmail2.com", "tempmaildemand.com", "tempmailo.com",
  "tempmails.net", "tempymail.com", "thraml.com", "throam.com",
  "throwawaymail.com", "tmail.ws", "tmail2.com", "tmpeml.com",
  "tmpmail.org", "trash-mail.com", "trash-mail.de", "trash2009.com",
  "trashdevil.com", "trashemail.de", "trashmail.com", "trashmail.de",
  "trashmail.io", "trashmail.me", "trashmail.net", "trashmail.org",
  "trashymail.com", "trbvm.com", "trillianpro.com", "veryrealemail.com",
  "wegwerfadresse.de", "wegwerfemail.de", "wegwerfemail.net",
  "wegwerfemail.org", "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org",
  "yopmail.com", "yopmail.fr", "yopmail.net", "zetmail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}

// Stricter format check than the default HTML email regex. Rejects:
//   - Multiple @s
//   - Domains with no TLD
//   - Local parts <2 chars
//   - Suspicious patterns like all-numeric or "test", "abc", "asdf" + digits
const SUSPICIOUS_LOCAL = /^(test|abc|abcd|abcdef|asdf|qwerty|zzz|aaa|xyz)\d*$/i;

export function looksFake(email: string): boolean {
  if (!email.includes("@")) return true;
  if (email.split("@").length !== 2) return true;
  const [local, domain] = email.split("@");
  if (local.length < 2) return true;
  if (!domain.includes(".")) return true;
  if (SUSPICIOUS_LOCAL.test(local)) return true;
  // All-digit local parts (e.g. "12345@gmail.com") are almost always fake
  if (/^\d+$/.test(local) && local.length < 6) return true;
  return false;
}
