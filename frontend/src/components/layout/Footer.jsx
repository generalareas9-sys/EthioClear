// src/components/layout/Footer.jsx
// Responsive footer that stacks neatly into columns on mobile with proper theme variables.

import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border-theme bg-surface py-8 px-4 sm:px-6 lg:px-8 text-text-muted transition-colors duration-150">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 pb-8 border-b border-border-theme">
          
          {/* Col 1: Brand & Description */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <Link to="/" aria-label="EthioClear Home">
              <img
                src="/logo.svg"
                alt="EthioClear"
                className="h-8 w-auto object-contain opacity-95"
                style={{ maxWidth: '170px' }}
              />
            </Link>
            <p className="text-xs leading-relaxed text-text-muted">
              Ethiopian Criminal Record Certificate Digital Management Platform.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-600 transition-colors">About EthioClear</Link>
              </li>
              <li>
                <Link to="/information" className="hover:text-primary-600 transition-colors">Requirements</Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-primary-600 transition-colors">Verify Certificate</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary-600 transition-colors">Help / FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Prototype Notice */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">Notice</h4>
            <p className="text-xs leading-relaxed text-text-muted">
              {t('footer.line1')}
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 text-center text-xs text-text-muted">
          <p>{t('footer.line2', { year })}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
