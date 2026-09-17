import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, Leaf, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import vegetables from '../assets/images/vegetables.webp';
import fruits from '../assets/images/fruits.webp';

const principles = [
  { icon: Leaf, title: 'Fresh by standard', text: 'We select produce and everyday essentials with freshness, quality, and value in mind.' },
  { icon: ShieldCheck, title: 'Clear and dependable', text: 'Straightforward pricing, secure checkout, and transparent order information at every step.' },
  { icon: HeartHandshake, title: 'Customer first', text: 'Helpful support and thoughtful service designed around the way households actually shop.' },
];

const journey = [
  { icon: Leaf, step: '01', title: 'Careful sourcing', text: 'Products are selected from trusted suppliers and evaluated against our quality requirements.' },
  { icon: PackageCheck, step: '02', title: 'Quality checked', text: 'Orders are reviewed and packed carefully to protect freshness during handling and transit.' },
  { icon: Truck, step: '03', title: 'Reliable delivery', text: 'Delivery updates help you follow your order from confirmation to your doorstep.' },
];

const AboutPage = () => (
  <main className="overflow-hidden bg-white font-sans text-[#19364d]">
    <section className="relative bg-[#f2faf6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#279b61]"><Sparkles size={15} /> Everyday freshness, made simple</span>
          <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">Better groceries for the way you live.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Freshq brings quality essentials, thoughtful selection, and dependable delivery together in one easy shopping experience.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-[#31b875] px-6 py-3.5 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-[#279b61]">Shop fresh products <ArrowRight size={18} /></Link>
            <Link to="/contact" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-black text-[#19364d] transition hover:border-emerald-300 hover:text-[#279b61]">Talk to our team</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#31b875]" /> Secure checkout</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#31b875]" /> Quality-focused selection</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#31b875]" /> Responsive support</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rotate-3 rounded-[2.75rem] bg-[#19364d]" />
          <img src={vegetables} alt="A fresh selection of vegetables" className="relative h-[430px] w-full rounded-[2.5rem] object-cover shadow-2xl sm:h-[520px]" />
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur sm:left-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#31b875]"><Clock3 size={22} /></span>
            <span><span className="block text-sm font-black">Convenience you can count on</span><span className="block text-xs text-slate-500">From cart to doorstep</span></span>
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <img src={fruits} alt="Fresh fruit selected for customers" className="h-[420px] w-full rounded-[2.5rem] object-cover shadow-[0_28px_70px_-35px_rgba(15,23,42,0.4)] sm:h-[520px]" />
          <div className="absolute bottom-5 right-5 max-w-[230px] rounded-2xl bg-[#19364d] p-5 text-white shadow-xl"><Leaf className="mb-3 text-[#55d493]" size={24} /><p className="font-black">Quality is not an extra.</p><p className="mt-1 text-sm leading-5 text-slate-300">It is the starting point for every Freshq order.</p></div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#31b875]">Our story</p>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Built to make everyday shopping feel effortless.</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
            <p>Freshq began with a straightforward idea: households should not have to choose between quality, convenience, and clarity when buying daily essentials.</p>
            <p>We are building a customer-focused grocery experience that makes products easier to discover, prices easier to understand, and orders easier to manage.</p>
            <p>Our work continues after checkout. From careful packing to clear delivery updates and accessible support, every detail is designed to earn trust over time.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#19364d] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#55d493]">What guides us</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">Principles behind every order.</h2><p className="mt-5 leading-7 text-slate-300">Simple promises, applied consistently across products, service, and support.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 transition hover:-translate-y-1 hover:bg-white/[0.09]"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#31b875] text-white"><Icon size={24} /></span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-300">{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="bg-[#f7faf8] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#31b875]">How Freshq works</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">From selection to delivery.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {journey.map(({ icon: Icon, step, title, text }) => <article key={step} className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"><span className="absolute right-6 top-5 text-4xl font-black text-slate-100">{step}</span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#31b875]"><Icon size={24} /></span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-500">{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#31b875] to-[#258f5c] p-8 text-white shadow-2xl shadow-emerald-100 sm:p-12 lg:flex-row lg:items-center">
        <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-100">Ready when you are</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Make your next grocery run a little easier.</h2><p className="mt-4 leading-7 text-emerald-50">Explore everyday essentials, discover fresh picks, and manage everything from one account.</p></div>
        <Link to="/shop" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-black text-[#258f5c] shadow-lg transition hover:-translate-y-0.5">Start shopping <ArrowRight size={18} /></Link>
      </div>
    </section>
  </main>
);

export default AboutPage;
