import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Body Safety · NutriMama" };

const LESSONS = [
  {
    emoji: "🛡️",
    title: "Your Body Belongs to You",
    titleHi: "तुम्हारा शरीर सिर्फ तुम्हारा है",
    body: "No one has the right to touch your body without your permission. You are the boss of your own body!",
    bodyHi: "बिना तुम्हारी अनुमति के कोई भी तुम्हारे शरीर को नहीं छू सकता।",
    color: "from-primary/10 to-primary/5 border-primary/20",
    headingColor: "text-primary",
  },
  {
    emoji: "✅",
    title: "What is a Good Touch?",
    titleHi: "अच्छा स्पर्श क्या है?",
    body: "A hug from a parent, a doctor checking you when you are sick, or a high-five from a friend — these are all good touches that feel safe and comfortable.",
    bodyHi: "माता-पिता की गले लगाई, बीमारी पर डॉक्टर की जाँच, या दोस्त का हाई-फाइव — ये सब अच्छे स्पर्श हैं जो सुरक्षित महसूस होते हैं।",
    color: "from-green-500/10 to-green-500/5 border-green-500/20",
    headingColor: "text-green-700 dark:text-green-400",
  },
  {
    emoji: "🚫",
    title: "What is a Bad Touch?",
    titleHi: "बुरा स्पर्श क्या है?",
    body: "Any touch that makes you feel uncomfortable, scared, or confused is a bad touch — especially on the parts of your body covered by swimwear. It is NEVER your fault.",
    bodyHi: "कोई भी स्पर्श जो तुम्हें असहज, डरा हुआ या भ्रमित महसूस कराए — वह बुरा स्पर्श है। यह कभी भी तुम्हारी गलती नहीं है।",
    color: "from-destructive/10 to-destructive/5 border-destructive/20",
    headingColor: "text-destructive",
  },
  {
    emoji: "🤐",
    title: "No More Secrets About Touches",
    titleHi: "स्पर्श के बारे में कोई राज़ नहीं",
    body: "If someone touches you in a bad way and asks you to keep it a secret, tell a trusted adult right away. Safe secrets (like birthday surprises) feel happy. Unsafe secrets feel scary or wrong.",
    bodyHi: "अगर कोई बुरे तरीके से छुए और राज़ रखने को कहे, तो तुरंत किसी भरोसेमंद बड़े को बताओ।",
    color: "from-secondary/20 to-secondary/5 border-secondary/30",
    headingColor: "text-secondary-foreground",
  },
  {
    emoji: "🙅",
    title: "You Can Say NO!",
    titleHi: "तुम 'नहीं' कह सकते हो!",
    body: "You always have the right to say NO to any touch that feels wrong — even from someone you know and love. Your 'No' is powerful and important.",
    bodyHi: "किसी भी गलत स्पर्श पर तुम 'नहीं' कह सकते हो — चाहे वो कोई परिचित हो। तुम्हारा 'नहीं' बहुत महत्वपूर्ण है।",
    color: "from-gold/10 to-gold/5 border-gold/20",
    headingColor: "text-foreground",
  },
  {
    emoji: "💬",
    title: "Tell a Trusted Adult",
    titleHi: "किसी भरोसेमंद बड़े को बताओ",
    body: "If something feels wrong, tell a trusted adult — your parent, teacher, or another grown-up you feel safe with. Keep telling until someone listens and helps you.",
    bodyHi: "अगर कुछ गलत लगे, तो अपने माता-पिता, शिक्षक या किसी भरोसेमंद बड़े को बताओ। जब तक कोई सुने और मदद न करे, बताते रहो।",
    color: "from-primary/10 to-accent/30 border-primary/15",
    headingColor: "text-primary",
  },
  {
    emoji: "🧒",
    title: "Private Parts",
    titleHi: "प्राइवेट पार्ट्स",
    body: "The parts of your body covered by a swimsuit are private. No one should look at or touch them except a doctor (with a parent present) or a caregiver helping you stay clean and healthy.",
    bodyHi: "स्विमसूट से ढके शरीर के हिस्से प्राइवेट हैं। डॉक्टर (माता-पिता के साथ) के अलावा कोई भी उन्हें नहीं देख या छू सकता।",
    color: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    headingColor: "text-purple-700 dark:text-purple-400",
  },
  {
    emoji: "📞",
    title: "Who to Call for Help",
    titleHi: "मदद के लिए किसे बुलाएं",
    body: "India Childline helpline: 1098 (free, 24/7). You can call anytime you feel scared or unsafe. There are kind people who will listen and help you.",
    bodyHi: "भारत चाइल्डलाइन: 1098 (मुफ़्त, 24/7)। जब भी डर लगे, कभी भी कॉल करें।",
    color: "from-green-500/10 to-green-500/5 border-green-500/20",
    headingColor: "text-green-700 dark:text-green-400",
  },
];

export default async function BodySafetyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  return (
    <main className="p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="mb-6 text-center">
        <p className="text-5xl mb-3">🛡️</p>
        <h1 className="font-heading text-3xl text-primary">Body Safety</h1>
        <p className="text-xs text-muted-foreground mt-1">
          शरीर की सुरक्षा · Important lessons to keep you safe
        </p>
      </header>

      {/* Childline banner */}
      <div className="mb-6 rounded-2xl bg-green-500/10 border border-green-500/30 p-4 flex items-center gap-4">
        <span className="text-3xl shrink-0">📞</span>
        <div>
          <p className="font-heading text-sm font-bold text-green-700 dark:text-green-400">
            India Childline · 1098
          </p>
          <p className="text-xs text-muted-foreground">
            Free · 24/7 · Call anytime you feel unsafe · हमेशा मदद के लिए
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {LESSONS.map((lesson) => (
          <div
            key={lesson.title}
            className={`rounded-2xl bg-linear-to-br ${lesson.color} border p-5`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0 mt-0.5" aria-hidden>
                {lesson.emoji}
              </span>
              <div>
                <h2 className={`font-heading text-base font-bold ${lesson.headingColor}`}>
                  {lesson.title}
                </h2>
                <p className="text-[11px] text-muted-foreground mb-2">{lesson.titleHi}</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{lesson.body}</p>
                <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed italic">
                  {lesson.bodyHi}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parent note */}
      <div className="mt-8 rounded-2xl bg-muted border border-border p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
          Note for Parents / Guardians
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Talk to your child regularly about body safety. Use simple, correct anatomical words.
          Reassure them that they will never be in trouble for telling you about a bad touch.
          If your child discloses abuse, stay calm, believe them, and contact Childline 1098
          or your local police immediately.
        </p>
      </div>
    </main>
  );
}
