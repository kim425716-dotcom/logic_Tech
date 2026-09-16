
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaHeart, FaWhatsapp } from 'react-icons/fa';
import { footerBrand, footerLinkGroups, footerSocial } from '../../data/footerLinks';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img
                src="/logo.png"
                alt="Logic Tech Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Logic<span className="text-violet-400">{footerBrand.accent}</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              {footerBrand.tagline}
            </p>
            <div className="flex items-center gap-3">
              {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 hover:text-violet-400 flex items-center justify-center text-slate-500 transition-all">
                  <Icon size={14} />
                </a>
              ))}
              <a
                href={footerSocial.email}
                title="Send us an email"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 hover:text-violet-400 flex items-center justify-center text-slate-500 transition-all"
              >
                <FaEnvelope size={14} />
              </a>
              <a
                href={footerSocial.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center text-slate-500 transition-all"
              >
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinkGroups).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Logic Tech. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made with <FaHeart className="text-red-500 text-xs" /> in Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
