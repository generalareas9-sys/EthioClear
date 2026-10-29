// src/components/layout/Footer.jsx
// Deep navy footer (#0A1A44) matching Figma marketing site with academic prototype honesty.

import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0A1A44] text-slate-300 border-t border-slate-800 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Academic Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" aria-label="EthioClear Home" className="inline-block">
              <Logo variant="dark" size="md" />
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Ethiopian Criminal Record Certificate Digital Management Platform. Designed for modern, transparent, and secure public service verification.
            </p>
            {/* National accent ribbon */}
            <div className="flex h-1 w-24 rounded-full overflow-hidden">
              <div className="w-1/3 bg-[#0E8A3E]"></div>
              <div className="w-1/3 bg-[#FCCB0B]"></div>
              <div className="w-1/3 bg-[#E11D1D]"></div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About EthioClear</Link>
              </li>
              <li>
                <Link to="/verify" className="text-slate-400 hover:text-white transition-colors">Verify Certificate</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Portals & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In / Account</Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">Apply for Clearance</Link>
              </li>
              <li>
                <Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help / FAQ</Link>
              </li>
              <li>
                <Link to="/information" className="text-slate-400 hover:text-white transition-colors">Application Requirements</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Integrity & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Academic Project</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Developed by <strong className="text-slate-200">Haramaya University</strong>, Department of Information Science. Designed strictly as an academic prototype demonstration.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><span className="text-slate-500">Contact:</span> oseidebrahim@gmail.com</div>
              <div><span className="text-slate-500">Phone:</span> 0986446282</div>
              <div><span className="text-slate-500">Location:</span> Harar, Haramaya, Ethiopia</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {year} EthioClear. Academic Prototype. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px] max-w-md">
            This platform is an educational prototype and does not issue legal criminal clearance documents or represent government authorities.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;