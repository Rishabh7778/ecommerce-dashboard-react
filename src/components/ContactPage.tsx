import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Navigation, Loader2, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 🔥 HANDLER: Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  // 🔥 HANDLER: Live Location On (Conceptual)
  const handleLiveLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingLocation(false);
          alert(`Bhai, Aapki location mil gayi! \nLatitude: ${position.coords.latitude} \nLongitude: ${position.coords.longitude}`);
          // Yahan tum Map ko re-center kar sakte ho coordinates use karke
        },
        () => {
          setLoadingLocation(false);
          alert("Bhai, Location access denied! Please settings check karein.");
        }
      );
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#253D4E]">
      
      {/* 1. TOP HEADER SECTION */}
      <section className="bg-[#f2fce4] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Humein <span className="text-[#3BB77E]">Sampark</span> Karein</h1>
        <p className="text-gray-500 max-w-2xl mx-auto px-4">
          Bitezone ki team hamesha aapki madad ke liye taiyar hai. Chahe wo order ho ya koi sujhav, hum bas ek message ki doori par hain.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 2. LEFT SIDE: Contact Info & Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Message Bhejein</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    required type="text" placeholder="Aapka Naam" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E]"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    required type="email" placeholder="Email Address" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <input 
                  required type="text" placeholder="Vishay (Subject)" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E]"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
                <textarea 
                  required rows={5} placeholder="Aapka Sandesh (Message)" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>

                <button 
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2
                    ${isSubmitted ? 'bg-green-500 text-white' : 'bg-[#253D4E] text-white hover:bg-black'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : isSubmitted ? <><CheckCircle2 size={20}/> Sent!</> : <><Send size={20}/> Message Bhejein</>}
                </button>
              </form>
            </div>
          </div>

          {/* 3. RIGHT SIDE: Contact Details & Quick Location */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
                <div className="p-3 bg-green-50 text-[#3BB77E] rounded-xl"><Phone size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p><p className="font-bold">+91 98765 43210</p></div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Mail size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Email Support</p><p className="font-bold">help@bitezone.com</p></div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl"><MapPin size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Head Office</p><p className="font-bold">South Delhi, India</p></div>
              </div>
            </div>

            {/* LIVE LOCATION BUTTON */}
            <div className="p-8 bg-gradient-to-br from-[#3BB77E] to-[#2fa06c] rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-2">Nearby Bitezone?</h3>
              <p className="text-sm opacity-80 mb-6">Apni live location on karein taaki hum aapke sabse nazdeeki outlet dikha sakein.</p>
              <button 
                onClick={handleLiveLocation}
                disabled={loadingLocation}
                className="w-full py-3 bg-white text-[#3BB77E] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
              >
                {loadingLocation ? <Loader2 className="animate-spin" size={18}/> : <><Navigation size={18}/> Live Location ON Karein</>}
              </button>
            </div>
          </div>

        </div>

        {/* 4. MAP SECTION (FULL WIDTH) */}
        <div className="mt-16 rounded-[2.5rem] overflow-hidden h-[450px] shadow-2xl border-4 border-white relative group">
          <iframe 
            title="Bitezone HQ Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112111.45906385614!2d77.10688975!3d28.5852504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24155555555%3A0xc3c5b96791e84c!2sSouth%20Delhi%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="w-full h-full border-none"
            allowFullScreen loading="lazy"
          ></iframe>
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold">Bitezone HQ - South Delhi</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;