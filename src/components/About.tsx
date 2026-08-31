import React from 'react';
import { 
  Heart, ShieldCheck, Zap, Award, TrendingUp, ArrowRight, 
  Leaf, Truck, Users, Star, Smartphone, Globe, CheckCircle, Package
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-[#f7faf8] font-sans text-[#19364d] overflow-x-hidden">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80" 
            alt="Bitezone Premium Fresh Food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102c42]/95 via-[#19364d]/80 to-[#19364d]/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3BB77E]/20 text-[#3BB77E] backdrop-blur-md border border-[#3BB77E]/30 mb-6">
              <Leaf size={16} />
              <span className="text-sm font-bold tracking-wider uppercase">Fresh groceries, thoughtfully delivered</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] text-white">
              Freshness you can <br />
              <span className="text-[#55d493]">trust every day.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Freshq brings dependable quality, transparent choices, and everyday convenience together in one simple grocery experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#31b875] text-white px-8 py-4 rounded-xl font-bold shadow-[0_8px_30px_rgb(49,184,117,0.3)] hover:bg-[#279b61] hover:-translate-y-1 transition-all flex items-center gap-2">
                Discover Freshq <ArrowRight size={18} />
              </button>
              <button className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                Our quality promise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING STATS BAR (E-commerce Style) */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(25,54,77,0.35)] p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          {[
            { number: "2M+", label: "Active Customers", icon: <Users className="text-[#3BB77E] mb-2" size={28}/> },
            { number: "500+", label: "Partner Farms", icon: <Leaf className="text-[#3BB77E] mb-2" size={28}/> },
            { number: "15M+", label: "Orders Delivered", icon: <Package className="text-[#3BB77E] mb-2" size={28}/> },
            { number: "99.8%", label: "On-Time Delivery", icon: <Zap className="text-[#3BB77E] mb-2" size={28}/> }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 hover:scale-105 transition-transform cursor-default">
              {stat.icon}
              <h3 className="text-3xl md:text-4xl font-black text-[#253D4E] mb-1">{stat.number}</h3>
              <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE BRAND STORY (Split Layout) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#3BB77E]/10 rounded-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#253D4E]/5 rounded-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" 
              alt="Bitezone Operations" 
              className="rounded-[2.5rem] shadow-2xl w-full object-cover h-[600px]"
            />
            {/* Overlay Badge */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-400 fill-yellow-400" size={32} />
                <div>
                  <p className="text-2xl font-black text-[#253D4E]">4.9/5</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">App Store Rating</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-[#3BB77E] font-bold tracking-wider uppercase text-sm mb-4 block">Our Origin Story</span>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Freshq Ka Janm: <br/> Swaad Aur Shuddhata Ki Khoj</h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Freshq ki shuruat ek simple khayal se hui thi: <strong>"Kya har ghar ko restaurant jaisa swaad aur khet jaisi taazgi ek sath mil sakti hai?"</strong> Pehle din se hi humara focus sirf delivery par nahi, balki quality supply chain build karne par tha.
              </p>
              <p>
                Humne local vendors, organic farmers, aur top culinary experts ke sath milkar ek aisa ecosystem banaya jo quality par kabhi compromise nahi karta. Aaj ke advanced e-commerce yug mein, hum AI aur machine learning ka use karte hain demand predict karne aur wastage ko zero karne ke liye.
              </p>
              <p>
                Aaj, Bitezone lakho parivaaron ki pehli pasand hai. Hum technology ka istemal karke ye ensure karte hain ki aapka khana 'farm-to-fork' tak ekdum fresh rahe. Hum traditional food delivery ko kal ki baat bana chuke hain.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-[#f2fce4] p-3 rounded-xl text-[#3BB77E]"><Award size={24}/></div>
                <div>
                  <h4 className="font-bold text-[#253D4E]">ISO Certified</h4>
                  <p className="text-sm text-gray-500 mt-1">100% hygiene & safety standards maintained.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><Globe size={24}/></div>
                <div>
                  <h4 className="font-bold text-[#253D4E]">Pan-India Reach</h4>
                  <p className="text-sm text-gray-500 mt-1">Operating in 150+ tier 1 & 2 cities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION (Bento Grid) */}
      <section className="py-20 bg-[#253D4E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Humara Lakshay (The Vision)</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Building the most transparent, efficient, and sustainable food commerce ecosystem in the country.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Box */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors">
              <TrendingUp className="text-[#3BB77E] mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4">Tech-Driven Supply Chain</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Humari proprietary routing algorithms aur temperature-controlled logistics ensure karte hain ki khana apne optimal state mein deliver ho. From predictive inventory at dark stores to last-mile delivery—everything is automated.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="text-[#3BB77E]" size={20} /> AI-Powered Route Optimization</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="text-[#3BB77E]" size={20} /> Real-time IoT Temperature Tracking</li>
              </ul>
            </div>

            {/* Small Box 1 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors flex flex-col justify-between">
              <div>
                <Heart className="text-red-400 mb-6" size={40} />
                <h3 className="text-2xl font-bold mb-4">Farmer Empowerment</h3>
                <p className="text-gray-300 leading-relaxed">
                  Hum middlemen ko hata kar sidha kisaano se judte hain. Isse kisaan ko behtar daam aur aapko behtareen quality milti hai.
                </p>
              </div>
            </div>

            {/* Small Box 2 */}
            <div className="bg-[#3BB77E] p-10 rounded-[2rem] text-[#253D4E] flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform">
              <h3 className="text-4xl font-black mb-2">Zero</h3>
              <p className="font-bold text-lg uppercase tracking-wide opacity-80">Carbon Footprint Goal by 2030</p>
            </div>

            {/* Medium Box */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors flex items-center justify-between">
              <div className="max-w-lg">
                <ShieldCheck className="text-blue-400 mb-4" size={40} />
                <h3 className="text-2xl font-bold mb-2">Uncompromised Quality</h3>
                <p className="text-gray-300">Har product 5-step quality check se guzarta hai packing se pehle. 100% Money-back guarantee agar aap satisfy nahi hain.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (Operational Flow) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#3BB77E] font-bold tracking-wider uppercase text-sm mb-2 block">The Process</span>
          <h2 className="text-4xl font-black mb-4 text-[#253D4E]">Khet Se Ghar Tak (Farm to Fork)</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Ek transparent e-commerce model jo freshness ki guarantee deta hai.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { icon: <Leaf />, title: "1. Sourcing", desc: "Premium quality produce sourced directly from partnered farms at sunrise." },
              { icon: <ShieldCheck />, title: "2. Quality Check", desc: "Rigorous 5-point hygiene and freshness inspection at our fulfillment centers." },
              { icon: <Package />, title: "3. Smart Packaging", desc: "Eco-friendly, temperature-retaining packing to preserve original taste." },
              { icon: <Truck />, title: "4. Hyperlocal Delivery", desc: "AI-routed delivery partners drop the order at your door in record time." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center relative hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-[#f2fce4] text-[#3BB77E] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  {React.cloneElement(step.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#253D4E]">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE VALUES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black mb-4 text-[#253D4E]">Humare Maap-Dand <br/>(Core Values)</h2>
              <p className="text-gray-500 text-lg">Hum sirf dhanda nahi karte, hum ek parivaar banate hain jo quality aur bharose par tika hai. Yeh values humare har business decision ko drive karti hain.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={32} className="text-red-500" />, title: "Customer Obsession", desc: "Aapki har feedback humare liye hukum hai. Hum wahi karte hain jo aapko khush kare. 24/7 priority support for all users." },
              { icon: <ShieldCheck size={32} className="text-blue-500" />, title: "Radical Transparency", desc: "Kahan se aaya, kab bana, aur kisne laya—aapko sab pata hoga. No hidden fees, no stale food." },
              { icon: <TrendingUp size={32} className="text-green-500" />, title: "Continuous Innovation", desc: "Hum rozana apne tech-stack ko behtar karte hain taaki UI smooth rahe aur delivery times aur bhi kam ho sakein." }
            ].map((val, idx) => (
              <div key={idx} className="bg-[#f8f9fa] p-10 rounded-[2.5rem] hover:bg-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] transition-all duration-300 group border border-transparent hover:border-gray-100">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-[#253D4E]">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MASSIVE CALL TO ACTION (App Promo Style) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#3BB77E] to-[#2fa06c] rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#253D4E]/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mb-10 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Bitezone Ke Sath <br/> Ek Naya Safar Shuru Karein
              </h2>
              <p className="text-green-50 text-xl mb-10 opacity-90 leading-relaxed">
                Join India's fastest-growing premium food commerce app. Get 50% off your first 3 orders and experience the magic of farm-fresh delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#253D4E] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-colors flex items-center gap-3">
                  <Smartphone size={24} /> Download App
                </button>
                <button className="bg-white text-[#3BB77E] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors flex items-center gap-3 shadow-lg">
                  Order on Web <ArrowRight size={20}/>
                </button>
              </div>
            </div>

            {/* Mockup / App Illustration Side */}
            <div className="relative z-10 w-full md:w-1/3 flex justify-center">
               <div className="w-64 h-96 bg-white rounded-[2.5rem] shadow-2xl border-8 border-[#253D4E] relative overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                 {/* Fake App Screen */}
                 <div className="bg-[#f2fce4] h-full w-full p-4">
                    <div className="w-full h-8 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                    <div className="w-3/4 h-6 bg-gray-200 rounded-full mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                      <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                    </div>
                    <div className="w-full h-32 bg-[#3BB77E]/20 rounded-xl mb-4"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
