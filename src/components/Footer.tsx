// Lucide se brand icons HATA dein, sirf normal UI icons rakhein:
import { MapPin, Headphones, Mail, Clock, PhoneCall } from 'lucide-react';

// react-icons se naye brand icons IMPORT karein:
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  // Footer Links Data
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Contact Us", "Support Center", "Careers"]
    },
    {
      title: "Account",
      links: ["Sign In", "View Cart", "My Wishlist", "Track My Order", "Help Ticket", "Shipping Details", "Compare products"]
    },
    {
      title: "Corporate",
      links: ["Become a Vendor", "Affiliate Program", "Farm Business", "Farm Careers", "Our Suppliers", "Accessibility", "Promotions"]
    },
    {
      title: "Popular",
      links: ["Milk & Flavoured Milk", "Butter and Margarine", "Eggs Substitutes", "Marmalades", "Sour Cream and Dips", "Tea & Kombucha", "Cheese"]
    }
  ];

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200 font-sans mt-12">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- TOP GRID SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          {/* 1. Contact Info Column (Takes more space on tablet) */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
            {/* Logo Placeholder */}
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <div className="text-4xl text-green-500 font-black tracking-tight flex items-center">
                <span className="text-yellow-400 mr-1 text-3xl">🥚</span>Nest
              </div>
            </div>
            
            <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
              Awesome grocery store website template
            </p>
            
            <ul className="space-y-4 text-[14px] text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-[#3BB77E] flex-shrink-0 mt-1" />
                <span><strong className="text-[#253D4E]">Address:</strong> 5171 W Campbell Ave undefined Kent, Utah 53127 United States</span>
              </li>
              <li className="flex items-start gap-2">
                <Headphones size={18} className="text-[#3BB77E] flex-shrink-0 mt-1" />
                <span><strong className="text-[#253D4E]">Call Us:</strong> <span className="text-[#3BB77E]">(+91)-540-025-124553</span></span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="text-[#3BB77E] flex-shrink-0 mt-1" />
                <span><strong className="text-[#253D4E]">Email:</strong> <span className="text-[#3BB77E]">sale@Nest.com</span></span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={18} className="text-[#3BB77E] flex-shrink-0 mt-1" />
                <span><strong className="text-[#253D4E]">Hours:</strong> 10:00 - 18:00, Mon - Sat</span>
              </li>
            </ul>
          </div>

          {/* 2-5. Links Columns */}
          {footerLinks.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-[22px] font-bold text-[#253D4E] mb-6">{col.title}</h3>
              <ul className="space-y-3.5">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-[14px] text-gray-500 hover:text-[#3BB77E] transition-colors hover:translate-x-1 inline-block transform duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 6. App & Payment Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-[22px] font-bold text-[#253D4E] mb-6">Install App</h3>
            <p className="text-[14px] text-gray-500 mb-4">From App Store or Google Play</p>
            
            {/* App Badges */}
            <div className="flex flex-col gap-3 mb-8">
              <button className="text-white rounded-md px-3 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors w-36">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
              </button>
              <button className="text-white rounded-md px-3 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors w-36">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
              </button>
            </div>

            <p className="text-[14px] text-gray-500 mb-4">Secured Payment Gateways</p>
            {/* Payment Icons (Using CSS shapes for representation) */}
            <div className="flex items-center gap-2">
               <div className="w-10 h-6 bg-blue-800 text-white font-bold italic text-[9px] flex items-center justify-center rounded">VISA</div>
               <div className="w-10 h-6 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                 <div className="w-4 h-4 bg-red-500 rounded-full -mr-1 mix-blend-multiply"></div>
                 <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-1 mix-blend-multiply"></div>
               </div>
               <div className="w-10 h-6 bg-blue-100 text-blue-800 font-bold text-[8px] flex items-center justify-center rounded">Maestro</div>
               <div className="w-10 h-6 bg-blue-400 text-white font-bold text-[8px] flex items-center justify-center rounded">AMEX</div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION (Copyright & Support) --- */}
        <div className="border-t border-green-100 pt-8 mt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <div className="text-[14px] text-gray-500 text-center lg:text-left">
            <p>© 2026, Nest - WordPress Ecommerce Template.</p>
            <p>All rights reserved</p>
          </div>

          {/* Support Numbers */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div className="flex items-center gap-3">
              <PhoneCall size={36} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-[#3BB77E] text-2xl font-bold leading-none">1900646666</span>
                <span className="text-[12px] text-gray-500 font-medium">Working 8:00 - 22:00</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall size={36} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-[#3BB77E] text-2xl font-bold leading-none">1900648888</span>
                <span className="text-[12px] text-gray-500 font-medium">24/7 Support Center</span>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-[#253D4E] mr-2">Follow Us</span>
              <a href="#" className="w-8 h-8 rounded-full bg-[#3BB77E] flex items-center justify-center text-white hover:bg-[#2fa06c] transition-colors"><FaFacebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#3BB77E] flex items-center justify-center text-white hover:bg-[#2fa06c] transition-colors"><FaTwitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#3BB77E] flex items-center justify-center text-white hover:bg-[#2fa06c] transition-colors"><FaInstagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#3BB77E] flex items-center justify-center text-white hover:bg-[#2fa06c] transition-colors"><FaYoutube size={16} /></a>
            </div>
            <p className="text-[13px] text-gray-500 mt-1">Up to 15% discount on your first subscribe</p>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;