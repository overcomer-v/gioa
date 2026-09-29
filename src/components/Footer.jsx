import { Link } from "react-router-dom";

import { generalPagePadding } from "../utils/constants";

export function Footer() {
  return (
    <footer className="mt-20 bg-neutral-950 text-white">
      {/* Accent line */}
      <div className="h-1 bg-secondary" />

      {/* Main footer */}
      <div className={`${generalPagePadding} py-14 md:py-20`}>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center text-3xl font-bold tracking-tight"
            >
              Gioa<span className="text-secondary">.</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-400">
              Quality electronics for the way you live, work and connect.
              Discover products from trusted brands, carefully selected for
              everyday use.
            </p>

            {/* Email */}
            <a
              href="mailto:atoyejeovercomer2@gmail.com"
              className="mt-6 inline-block text-sm text-neutral-300 transition hover:text-secondary"
            >
              atoyejeovercomer2@gmail.com
            </a>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-3">
              <SocialLink
                href="#"
                label="Facebook"
                icon="fab fa-facebook-f"
              />

              <SocialLink
                href="#"
                label="Google"
                icon="fab fa-google"
              />

              <SocialLink
                href="#"
                label="WhatsApp"
                icon="fab fa-whatsapp"
              />
            </div>
          </div>

          {/* Shop */}
          <div>
            <FooterHeading>Shop</FooterHeading>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink to="/products">
                All Products
              </FooterLink>

              <FooterLink to="/categories">
                Categories
              </FooterLink>

              <FooterLink to="/brands">
                Brands
              </FooterLink>

              <FooterLink to="/products">
                New Arrivals
              </FooterLink>
            </div>
          </div>

          {/* Company */}
          <div>
            <FooterHeading>Company</FooterHeading>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink to="/about">
                About Gioa
              </FooterLink>

              <FooterLink to="/contact">
                Contact Us
              </FooterLink>

              <FooterLink to="/privacy">
                Privacy Policy
              </FooterLink>

              <FooterLink to="/terms">
                Terms & Conditions
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div
          className={`${generalPagePadding} flex flex-col gap-3 py-5 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between`}
        >
          <span>
            © {new Date().getFullYear()} Gioa. All rights reserved.
          </span>

          <span className="text-neutral-600">
            Built for <span className="text-secondary">better</span> everyday
            tech.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({ children }) {
  return (
    <h3 className="relative w-fit text-sm font-semibold">
      {children}

      <span className="absolute -bottom-2 left-0 h-0.5 w-5 rounded-full bg-secondary" />
    </h3>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="w-fit text-sm text-neutral-400 transition hover:translate-x-1 hover:text-secondary"
    >
      {children}
    </Link>
  );
}

/* =========================================================
   SOCIAL LINK
========================================================= */

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-neutral-400 transition hover:border-secondary hover:bg-secondary hover:text-black"
    >
      <i className={icon} />
    </a>
  );
}