import React from 'react';
import { Hexagon, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
   return (
      <footer className="border-t border-white/10 bg-black pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
               {/* About Section - Boxed */}
               <div className="w-full lg:w-1/3">
                  <div className="border border-white/10 rounded-3xl p-8">
                     <div className="flex items-center gap-2 mb-6">
                        <Hexagon className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                        <span className="text-xl font-bold"><span className="text-indigo-400">Z</span>yntra</span>
                     </div>
                     <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        The world's most advanced cryptocurrency trading platform. Secure, fast, and built for the future of finance.
                     </p>
                     <div className="flex gap-4 justify-center lg:justify-start">
                        {[Twitter, Github, Linkedin].map((Icon, i) => (
                           <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                              <Icon className="w-5 h-5" />
                           </a>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Links Section - 3 Columns on Mobile & Desktop */}
               <div className="w-full lg:w-2/3 grid grid-cols-3 gap-4 lg:gap-8">
                  {[
                     { header: "Platform", links: ["Markets", "Exchange", "Earn", "Wallet", "Institutional"] },
                     { header: "Support", links: ["Help Center", "API Documentation", "Fees", "Security", "Contact"] },
                     { header: "Company", links: ["About", "Careers", "Blog", "Press", "Legal"] }
                  ].map((col, idx) => (
                     <div key={idx}>
                        <h4 className="font-bold mb-6 text-white text-lg">{col.header}</h4>
                        <ul className="space-y-4">
                           {col.links.map(link => (
                              <li key={link}>
                                 <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{link}</a>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-gray-500 text-sm">© 2024 Zyntra Exchange. All rights reserved.</p>
               <div className="flex gap-8 text-sm text-gray-500">
                  <a href="#" className="hover:text-white">Privacy Policy</a>
                  <a href="#" className="hover:text-white">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;