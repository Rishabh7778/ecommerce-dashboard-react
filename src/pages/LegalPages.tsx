import { CheckCircle2, FileText, LockKeyhole, Mail, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

type LegalSection = { title: string; body: string; bullets?: string[] };

const privacySections: LegalSection[] = [
  { title: 'Information we collect', body: 'We collect information that you provide directly and limited technical information required to operate Freshq.', bullets: ['Account details such as your name and email address.', 'Order, delivery, and customer-support information.', 'Device, browser, and usage data used for security and service performance.'] },
  { title: 'How we use your information', body: 'We use personal information only for legitimate business and service purposes.', bullets: ['To create and manage your account.', 'To process orders, coordinate delivery, and provide order updates.', 'To respond to support requests, prevent fraud, and improve Freshq services.'] },
  { title: 'Payments', body: 'Payment transactions may be handled by authorised payment service providers. Freshq does not intend to store complete card details on its own systems.' },
  { title: 'When information is shared', body: 'We may share limited information with delivery, payment, infrastructure, analytics, and support providers when necessary to provide the service. We do not sell personal information.' },
  { title: 'Data retention and security', body: 'We retain information only for as long as reasonably necessary for service, legal, accounting, and security purposes. We use appropriate administrative and technical safeguards, although no online system can be guaranteed to be completely secure.' },
  { title: 'Your choices and rights', body: 'Depending on applicable law, you may request access to, correction of, or deletion of certain personal information. You may also update available profile information through your account.' },
  { title: 'Children’s privacy', body: 'Freshq is not directed to children under 13, and we do not knowingly collect personal information from children under 13.' },
  { title: 'Policy updates', body: 'We may update this policy when our services or legal obligations change. The revised date shown on this page indicates when the latest version took effect.' },
];

const termsSections: LegalSection[] = [
  { title: 'Agreement to these terms', body: 'By accessing or using Freshq, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the service.' },
  { title: 'Account responsibilities', body: 'You must provide accurate information, keep your credentials secure, and notify us promptly if you believe your account has been used without permission.' },
  { title: 'Products, pricing, and availability', body: 'Product descriptions, availability, images, and prices may change. We make reasonable efforts to present accurate information, but minor variations may occur. The price confirmed at checkout is the price applicable to your order.' },
  { title: 'Orders and payment', body: 'Submitting an order is an offer to purchase. An order is accepted when Freshq confirms it. We may decline or cancel an order due to stock, pricing errors, payment issues, delivery limitations, or suspected misuse. Any eligible refund will be returned through the original payment method.' },
  { title: 'Delivery', body: 'Delivery times are estimates and may be affected by availability, traffic, weather, location, or operational conditions. You are responsible for providing accurate delivery details and ensuring someone can receive the order.' },
  { title: 'Cancellations, returns, and refunds', body: 'Eligibility depends on the product, order status, and condition of the item. Please contact support promptly if an order is missing, damaged, incorrect, or otherwise unsuitable.' },
  { title: 'Acceptable use', body: 'You may not misuse Freshq, interfere with its operation, attempt unauthorised access, submit false information, or use the service for unlawful or fraudulent activity.' },
  { title: 'Intellectual property', body: 'Freshq branding, designs, software, text, graphics, and other content are owned by or licensed to Freshq and may not be copied or commercially reused without written permission.' },
  { title: 'Service availability and liability', body: 'We work to keep Freshq reliable, but the service may occasionally be interrupted. To the extent permitted by law, Freshq is not responsible for indirect or consequential losses resulting from use of the service.' },
  { title: 'Changes and governing law', body: 'We may update these terms to reflect service or legal changes. Continued use after an update means you accept the revised terms. These terms are governed by the laws applicable in India, subject to mandatory consumer protections.' },
];

const LegalLayout = ({ type }: { type: 'privacy' | 'terms' }) => {
  const privacy = type === 'privacy';
  const title = privacy ? 'Privacy Policy' : 'Terms & Conditions';
  const summary = privacy ? 'How Freshq collects, uses, protects, and shares information when you use our services.' : 'The rules and responsibilities that apply when you access Freshq, create an account, or place an order.';
  const sections = privacy ? privacySections : termsSections;
  const Icon = privacy ? ShieldCheck : Scale;
  const questionTitle = privacy ? 'Questions about this privacy policy?' : 'Questions about these terms and conditions?';

  return (
    <main className="min-h-screen bg-[#f7faf8] pb-20 font-sans text-[#19364d]">
      <section className="relative overflow-hidden bg-[#19364d] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#31b875]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#55d493]"><Icon size={28} /></span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#55d493]">Freshq legal</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{summary}</p>
          <p className="mt-6 text-sm font-bold text-slate-400">Effective date: 17 September 2026</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">On this page</p>
          <nav className="mt-4 space-y-1" aria-label={`${title} sections`}>
            {sections.map((section, index) => <a key={section.title} href={`#legal-section-${index + 1}`} className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-emerald-50 hover:text-[#279b61]">{index + 1}. {section.title}</a>)}
          </nav>
        </aside>

        <div>
          <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900"><LockKeyhole className="mt-0.5 shrink-0 text-[#31b875]" size={20} /><p>{privacy ? 'We believe privacy information should be clear and useful. This policy explains our practices in plain language.' : 'Please read these terms carefully. They form an agreement between you and Freshq when you use the service.'}</p></div>
          <div className="space-y-5">
            {sections.map((section, index) => <article id={`legal-section-${index + 1}`} key={section.title} className="scroll-mt-28 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-[#31b875]">{index + 1}</span><div><h2 className="text-xl font-black sm:text-2xl">{section.title}</h2><p className="mt-3 leading-7 text-slate-600">{section.body}</p>{section.bullets && <ul className="mt-4 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-slate-600"><CheckCircle2 size={18} className="mt-1 shrink-0 text-[#31b875]" /><span className="leading-6">{bullet}</span></li>)}</ul>}</div></div>
            </article>)}
          </div>

          <div className="mt-7 rounded-2xl bg-[#19364d] p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#55d493]"><Mail size={21} /></span><div><h2 className="font-black">{questionTitle}</h2><p className="mt-1 text-sm text-slate-300">Our support team can help clarify how this document applies to Freshq services.</p></div></div><Link to="/contact" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#31b875] px-5 py-3 text-sm font-black text-white">Contact support</Link></div>
          </div>

          <div className="mt-6 flex items-start gap-3 text-xs leading-5 text-slate-400"><FileText size={16} className="mt-0.5 shrink-0" /><p>This page provides Freshq’s current service policy. Mandatory rights available under applicable consumer and data-protection law are not limited by this document.</p></div>
        </div>
      </section>
    </main>
  );
};

export const PrivacyPolicy = () => <LegalLayout type="privacy" />;
export const TermsConditions = () => <LegalLayout type="terms" />;
