import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Navigation, Loader2, CheckCircle2, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import { usePostMessageMutation } from '../services/contactApi'; // Sahi path brackets me check kar lena bhai

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 🔥 RTK Query Mutation Hook
  const [postMessage, { isLoading: isSubmitting }] = usePostMessageMutation();

  // 🔥 HANDLER: Contact Form Submit via RTK Query
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isVerified) return;

    setApiMessage(null);

    try {
      // Backend controller ko data payload bhejna
      const response = await postMessage(formData).unwrap();
      
      setApiMessage({ type: 'success', text: response.message || "Sandesh safaltapurvak bhej diya gaya hai!" });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsVerified(false); // Anti-bot check reset

      // 5 seconds baad success notification clear karna
      setTimeout(() => setApiMessage(null), 5000);
    } catch (error: any) {
      console.error("Form submit error:", error);
      setApiMessage({ 
        type: 'error', 
        text: error?.data?.error || "Kuch gadbad hui! Kripya baad mein prayas karein." 
      });
    }
  };

  // 🔥 HANDLER: Live Location On
  const handleLiveLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingLocation(false);
          alert(`Bhai, Aapki location mil gayi! \nLatitude: ${position.coords.latitude} \nLongitude: ${position.coords.longitude}`);
        },
        () => {
          setLoadingLocation(false);
          alert("Bhai, Location access denied! Please settings check karein.");
        }
      );
    } else {
      setLoadingLocation(false);
      alert("Aapka browser geolocation support nahi karta.");
    }
  };

  return (
    <div className="bg-[#f7faf8] min-h-screen font-sans text-[#19364d] selection:bg-[#31b875] selection:text-white pb-20">
      
      {/* 1. HERO SECTION WITH CREATIVE SHAPES */}
      <section className="relative bg-[#19364d] pt-24 pb-44 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3BB77E] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[#3BB77E] font-medium mb-6 border border-white/10">
            <MessageSquare size={18} />
            <span>Freshq customer care</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">
            We are here to <span className="text-[#55d493] relative inline-block">
              help
              <svg className="absolute -bottom-2 left-0 w-full text-[#3BB77E] opacity-50" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" fill="transparent" stroke="currentColor" strokeWidth="4"/></svg>
            </span> Karein
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light">
            Questions about an order, product, or delivery? Our support team is just one message away.
          </p>
        </div>
      </section>

      {/* 2. OVERLAPPING CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT SIDE: Contact Info & Location Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_-28px_rgba(25,54,77,0.3)] border border-gray-100 flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#31b875]">Talk to our team</p><h3 className="text-2xl font-extrabold mb-2">Reach out to Freshq</h3>
              
              <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-green-50 transition-colors duration-300 cursor-pointer">
                <div className="p-4 bg-gray-50 group-hover:bg-white group-hover:shadow-md text-[#3BB77E] rounded-xl transition-all duration-300 shadow-sm"><Phone size={24}/></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="font-bold text-lg text-[#253D4E]">+91 98765 43210</p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-green-50 transition-colors duration-300 cursor-pointer">
                <div className="p-4 bg-gray-50 group-hover:bg-white group-hover:shadow-md text-[#3BB77E] rounded-xl transition-all duration-300 shadow-sm"><Mail size={24}/></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email Support</p>
                  <p className="font-bold text-lg text-[#253D4E]">help@freshq.com</p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-green-50 transition-colors duration-300 cursor-pointer">
                <div className="p-4 bg-gray-50 group-hover:bg-white group-hover:shadow-md text-[#3BB77E] rounded-xl transition-all duration-300 shadow-sm"><MapPin size={24}/></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Head Office</p>
                  <p className="font-bold text-lg text-[#253D4E]">South Delhi, India</p>
                </div>
              </div>
            </div>

            {/* LIVE LOCATION WIDGET */}
            <div className="relative overflow-hidden p-8 rounded-3xl text-white shadow-xl shadow-green-900/20 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3BB77E] via-[#2ba36a] to-[#1e7a4e] z-0"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">Find Freshq near you</h3>
                <p className="text-sm text-green-50 mb-8 leading-relaxed">Share your location to find the nearest service area and faster delivery options.</p>
                <button 
                  onClick={handleLiveLocation}
                  disabled={loadingLocation}
                  className="w-full py-4 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-[#2ba36a] rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 border border-white/30"
                >
                  {loadingLocation ? <Loader2 className="animate-spin" size={20}/> : <><Navigation size={20} className={loadingLocation ? "" : "animate-bounce"}/> Live Location ON Karein</>}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_-28px_rgba(25,54,77,0.3)] border border-gray-100">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#31b875] mb-3">Send us a message</p><h2 className="text-3xl font-black text-[#19364d] mb-3">How can we help?</h2>
                <p className="text-gray-500">Share your question and our team will get back to you shortly.</p>
              </div>
              
              {/* Dynamic Notification Panel */}
              {apiMessage && (
                <div className={`p-4 mb-6 rounded-2xl flex items-center gap-3 border ${
                  apiMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {apiMessage.type === 'success' ? <CheckCircle2 size={22}/> : <AlertCircle size={22}/>}
                  <p className="text-sm font-semibold">{apiMessage.text}</p>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Aapka Naam</label>
                    <input 
                      required type="text" placeholder="Rahul Kumar" 
                      className="w-full px-6 py-4 bg-[#f8fcf9] border-2 border-transparent rounded-2xl outline-none focus:border-[#3BB77E] focus:bg-white transition-all shadow-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                    <input 
                      required type="email" placeholder="rahul@example.com" 
                      className="w-full px-6 py-4 bg-[#f8fcf9] border-2 border-transparent rounded-2xl outline-none focus:border-[#3BB77E] focus:bg-white transition-all shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">Vishay (Subject)</label>
                  <input 
                    required type="text" placeholder="Mera order delay ho gaya hai..." 
                    className="w-full px-6 py-4 bg-[#f8fcf9] border-2 border-transparent rounded-2xl outline-none focus:border-[#3BB77E] focus:bg-white transition-all shadow-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">Aapka Sandesh (Message)</label>
                  <textarea 
                    required rows={5} placeholder="Puri detail yahan likhein..." 
                    className="w-full px-6 py-4 bg-[#f8fcf9] border-2 border-transparent rounded-2xl outline-none focus:border-[#3BB77E] focus:bg-white transition-all resize-none shadow-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                {/* Anti-Bot Checkbox Validation Component */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="humanVerify"
                    required
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#3BB77E] cursor-pointer rounded"
                  />
                  <label htmlFor="humanVerify" className="text-sm text-gray-600 cursor-pointer select-none">
                    Main confirm karta hoon ki main ek <span className="font-bold text-[#253D4E]">Insaan (Human)</span> hoon aur Bitezone ki <a href="#" className="text-[#3BB77E] hover:underline">Privacy Policy</a> se sehmat hoon.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !isVerified}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex justify-center items-center gap-3 text-lg mt-4
                    ${!isVerified 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                      : 'bg-[#253D4E] text-white hover:bg-[#3BB77E] hover:-translate-y-1 shadow-lg shadow-green-500/30'}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24}/>
                  ) : !isVerified ? (
                    <><ShieldCheck size={20}/> Pehle Checkbox Tick Karein</>
                  ) : (
                    <><Send size={20}/> Message Bhejein</>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* 3. MAP SECTION (BOTTOM WIDE) */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 rounded-[3rem] rotate-1 scale-105 opacity-10 z-0"></div>
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden h-[450px] shadow-2xl border-[6px] border-white group">
            <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#3BB77E]"></span>
              </span>
              <div>
                <p className="text-sm font-black text-[#253D4E]">Bitezone HQ</p>
                <p className="text-xs text-gray-500 font-medium">South Delhi, India</p>
              </div>
            </div>
            
            <iframe 
              title="Bitezone HQ Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112111.45906385614!2d77.10688975!3d28.5852504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24155555555%3A0xc3c5b96791e84c!2sSouth%20Delhi%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="w-full h-full border-none grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              allowFullScreen loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
