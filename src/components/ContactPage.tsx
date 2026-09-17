import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Headphones, Loader2, Mail, MapPin, MessageSquare, Phone, Send, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePostMessageMutation } from '../services/contactApi';

const contactMethods = [
  { icon: Phone, label: 'Call us', value: '+91 89204 64643', detail: 'Available 24 hours a day', href: 'tel:8920464643' },
  { icon: Mail, label: 'Email support', value: 'help@freshq.com', detail: 'We usually reply within one business day', href: 'mailto:help@freshq.com' },
  { icon: MapPin, label: 'Head office', value: 'South Delhi, India', detail: 'Freshq customer operations', href: undefined },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [postMessage, { isLoading }] = usePostMessageMutation();

  const updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) return;
    setApiMessage(null);

    try {
      const response = await postMessage(formData).unwrap();
      setApiMessage({ type: 'success', text: response.message || 'Your message has been sent successfully. Our team will be in touch soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setConsent(false);
    } catch (error: any) {
      setApiMessage({ type: 'error', text: error?.data?.error || 'We could not send your message. Please try again or contact us by phone.' });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7faf8] font-sans text-[#19364d]">
      <section className="relative overflow-hidden bg-[#19364d] px-4 pb-32 pt-20 text-white sm:px-6 lg:px-8 lg:pb-40 lg:pt-24">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#31b875]/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#55d493]"><MessageSquare size={15} /> Freshq customer care</span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">How can we help you today?</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Whether you have a question about an order, delivery, product, or your account, our team is ready to help.</p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#31b875]">Contact details</p>
              <h2 className="mt-3 text-2xl font-black">Choose the easiest way to reach us.</h2>
              <div className="mt-7 divide-y divide-slate-100">
                {contactMethods.map(({ icon: Icon, label, value, detail, href }) => {
                  const content = <><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#31b875]"><Icon size={22} /></span><span className="min-w-0"><span className="block text-xs font-black uppercase tracking-wider text-slate-400">{label}</span><span className="mt-1 block font-black text-[#19364d]">{value}</span><span className="mt-0.5 block text-sm text-slate-500">{detail}</span></span>{href && <ArrowRight size={17} className="ml-auto text-slate-300" />}</>;
                  return href ? <a key={label} href={href} className="flex items-center gap-4 py-5 transition hover:text-[#31b875]">{content}</a> : <div key={label} className="flex items-center gap-4 py-5">{content}</div>;
                })}
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-[#31b875] to-[#258f5c] p-7 text-white shadow-xl shadow-emerald-100 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Clock3 size={24} /></span>
              <h3 className="mt-6 text-2xl font-black">Support that respects your time.</h3>
              <p className="mt-3 leading-7 text-emerald-50">Include your order number when writing about an existing order. It helps our team investigate and respond faster.</p>
              <Link to="/account/orders" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#258f5c]">View my orders <ArrowRight size={16} /></Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
            <div className="mb-8 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#31b875]"><Headphones size={24} /></span>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#31b875]">Send a message</p><h2 className="mt-2 text-3xl font-black">Tell us what you need.</h2><p className="mt-2 text-slate-500">Complete the form and our support team will follow up by email.</p></div>
            </div>

            {apiMessage && <div role="status" className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${apiMessage.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>{apiMessage.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={20} /> : <AlertCircle className="mt-0.5 shrink-0" size={20} />}<p className="text-sm font-bold leading-6">{apiMessage.text}</p></div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <ContactField label="Full name" name="name" value={formData.name} onChange={updateField} placeholder="Your full name" />
                <ContactField label="Email address" name="email" type="email" value={formData.email} onChange={updateField} placeholder="you@example.com" />
              </div>
              <ContactField label="Subject" name="subject" value={formData.subject} onChange={updateField} placeholder="How can we help?" />
              <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">Message</span><textarea required name="message" rows={6} value={formData.message} onChange={updateField} placeholder="Share the details of your question or issue..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#31b875]" /><span>I agree that Freshq may use the information provided to respond to this enquiry, in accordance with the <Link to="/privacy" className="font-black text-[#279b61] hover:underline">Privacy Policy</Link>.</span></label>

              <button type="submit" disabled={isLoading || !consent} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#19364d] px-6 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#31b875] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" size={19} /> : <Send size={19} />}{isLoading ? 'Sending message...' : 'Send message'}
              </button>
              <p className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={15} className="text-[#31b875]" /> Your contact information is used only to handle your request.</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

const ContactField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">{label}</span><input required {...props} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>;

export default ContactPage;
