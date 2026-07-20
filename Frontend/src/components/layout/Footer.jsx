import { Link } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import SchoolLogo from "../ui/SchoolLogo";

export default function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = settings?.socialLinks || {};

  return (
    <footer className="bg-ink text-white">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SchoolLogo className="w-11 h-11 rounded-lg ring-1 ring-white/10" />
              <h3 className="font-heading font-bold text-lg">{settings?.schoolName || "Rising Star Public School"}</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{settings?.description}</p>
            <div className="flex gap-3 mt-5">
              {Object.entries(socialLinks).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-white/15 hover:border-accent hover:text-accent rounded-full flex items-center justify-center transition-all duration-300 text-sm capitalize"
                    aria-label={platform}
                  >
                    {platform[0].toUpperCase()}
                  </a>
                ) : null
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-wide uppercase text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About", "Academics", "Admissions"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link === "Home" ? "" : link.toLowerCase()}`}
                    className="text-white/60 hover:text-brand-light text-sm transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-wide uppercase text-white/40 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {["Faculty", "Gallery", "Events", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-white/60 hover:text-brand-light text-sm transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-wide uppercase text-white/40 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 opacity-70">📍</span>
                <span>{settings?.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="opacity-70">📞</span>
                <a href={`tel:${settings?.phone}`} className="hover:text-accent transition-colors">
                  {settings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="opacity-70">✉️</span>
                <a href={`mailto:${settings?.email}`} className="hover:text-accent transition-colors">
                  {settings?.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="opacity-70">🕐</span>
                <span>{settings?.timings}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/40">
          <p>
            © {new Date().getFullYear()} {settings?.schoolName || "Rising Star Public School"}. All rights reserved.
          </p>
          <p>Designed with care for quality education</p>
        </div>
      </div>
    </footer>
  );
}
