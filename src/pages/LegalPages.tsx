import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const LegalLayout = ({ type }: { type: 'privacy' | 'terms' }) => {
  const privacy = type === 'privacy';
  const title = privacy ? 'Privacy Policy' : 'Terms & Conditions';
  const Icon = privacy ? ShieldCheck : FileText;
  const sections = privacy ? [
    ['Information we collect', 'We collect only the information needed to process orders, provide support, and improve your Freshq experience.'],
    ['How we use information', 'Your details are used for order fulfilment, delivery updates, payment support, and relevant service communication.'],
    ['Data protection', 'We use reasonable safeguards to protect your personal information and never sell personal data to third parties.'],
    ['Your choices', 'You can contact our support team to review or update your account information.'],
  ] : [
    ['Using Freshq', 'Please provide accurate account and delivery information while using Freshq services.'],
    ['Orders and pricing', 'Product availability, pricing, and offers may change. The final payable amount is always shown before checkout.'],
    ['Delivery and support', 'Delivery timelines may vary by location, availability, and operational conditions.'],
    ['Account responsibility', 'Keep your sign-in information secure and inform us promptly about unauthorized account use.'],
  ];

  return <main className="min-h-screen bg-[#f4fbf7] pb-20 font-sans text-[#19364d]">
    <section className="mx-auto max-w-4xl px-4 pt-14 sm:px-6 lg:px-8"><div className="rounded-[2rem] bg-[#19364d] p-8 text-white shadow-xl sm:p-12"><span className="inline-flex rounded-2xl bg-white/10 p-3 text-[#55d493]"><Icon size={28}/></span><p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#55d493]">Freshq legal</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Last updated: August 31, 2026. Please read this page to understand how Freshq services work.</p></div>
      <div className="mt-8 space-y-5">{sections.map(([heading, body], index) => <article key={heading} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-[#31b875]">{index + 1}</span><div><h2 className="text-xl font-extrabold">{heading}</h2><p className="mt-3 leading-7 text-slate-600">{body}</p></div></div></article>)}</div>
      <div className="mt-8 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900"><CheckCircle2 className="shrink-0 text-[#31b875]" size={20}/><p>Questions about this {title.toLowerCase()}? Contact us at <a className="font-bold underline" href="mailto:help@freshq.com">help@freshq.com</a>.</p></div>
    </section>
  </main>;
};

export const PrivacyPolicy = () => <LegalLayout type="privacy" />;
export const TermsConditions = () => <LegalLayout type="terms" />;
