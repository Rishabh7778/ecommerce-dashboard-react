import React from 'react';
import {  Heart, ShieldCheck, Zap,  Award, TrendingUp, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white font-sans text-[#253D4E]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#f2fce4]">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80" 
            alt="Food Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            We Bring <span className="text-[#3BB77E]">Nature</span> <br /> To Your Doorstep
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bitezone sirf ek food platform nahi hai, ye ek vaada hai—shuddhata, swaad, aur super-fast delivery ka. Hum khane ko sirf deliver nahi karte, hum ek anubhav (experience) deliver karte hain.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#3BB77E] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#2fa06c] transition-all flex items-center gap-2">
              Our Journey <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE BITEZONE STORY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full -z-10 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" 
              alt="Our Story" 
              className="rounded-[2.5rem] shadow-2xl"
            />
            <div className="absolute bottom-8 right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-bold text-[#3BB77E]">10+</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Years of Excellence</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">Bitezone Ka Janm: Swaad Aur Shuddhata Ki Khoj</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Bitezone ki shuruat ek simple khayal se hui thi: "Kya har ghar ko restaurant jaisa swaad aur khet jaisi taazgi ek sath mil sakti hai?" Humne local vendors aur top chefs ke sath milkar ek aisa ecosystem banaya jo quality par kabhi compromise nahi karta.
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Aaj, Bitezone hazaron logon ki pehli pasand hai. Hum technology ka istemal karke ye ensure karte hain ki aapka khana 'farm-to-fork' tak ekdum fresh rahe. Humne traditional food delivery ko redefine kiya hai.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-[#3BB77E]"><Award size={24}/></div>
                <div><h4 className="font-bold">Top Quality</h4><p className="text-xs text-gray-400">Certified hygiene standards</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Zap size={24}/></div>
                <div><h4 className="font-bold">Fastest Delivery</h4><p className="text-xs text-gray-400">Average 30 min doorstep delivery</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="bg-[#253D4E] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-black text-white mb-2">500K+</h3>
            <p className="text-green-400 font-bold text-sm">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white mb-2">150+</h3>
            <p className="text-green-400 font-bold text-sm">Outlet Locations</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white mb-2">2000+</h3>
            <p className="text-green-400 font-bold text-sm">Daily Deliveries</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white mb-2">4.8</h3>
            <p className="text-green-400 font-bold text-sm">Average Rating</p>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES SECTION */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Humare Maap-Dand (Core Values)</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Hum sirf dhanda nahi karte, hum ek parivaar banate hain jo quality aur bharose par tika hai.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Heart className="text-red-500" />, title: "Customer First", desc: "Aapki har feedback humare liye hukum hai. Hum wahi karte hain jo aapko khush kare." },
            { icon: <ShieldCheck className="text-blue-500" />, title: "Safe & Secure", desc: "Hygiene humari top priority hai. Every bite is checked for safety." },
            { icon: <TrendingUp className="text-green-500" />, title: "Innovation", desc: "Hum rozana technology behtar karte hain taaki aapko behatareen service mile." }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3BB77E] transition-colors">
                {React.cloneElement(val.icon, { className: 'group-hover:text-white transition-colors' })}
              </div>
              <h3 className="text-xl font-extrabold mb-4">{val.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 bg-[#3BB77E] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Bitezone Ke Sath <br/> Ek Naya Safar Shuru Karein</h2>
          <p className="text-green-50 mb-10 text-lg opacity-80">Download the app and join the community of food lovers.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-[#253D4E] text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">Download App</button>
            <button className="bg-white text-[#3BB77E] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">Contact Us</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;