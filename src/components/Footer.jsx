import { Link } from "react-router-dom";
import { generalPagePadding } from "../utils/constants";

export function Footer() {
  return (
    <footer className="mt-20 bg-neutral-950 text-white">
      {/* Main footer */}
      <div className={`${generalPagePadding} py-14 md:py-20`}>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-3xl font-bold tracking-tight"
            >
              Gioa.
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-400">
              Quality electronics for the way you live, work and
              connect. Discover products from trusted brands,
              carefully selected for everyday use.
            </p>

            {/* Email */}
            <a
              href="mailto:atoyejeovercomer2@gmail.com"
              className="mt-6 inline-block text-sm text-neutral-300 transition hover:text-white"
            >
              atoyejeovercomer2@gmail.com
            </a>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <i className="fab fa-facebook-f" />
              </a>

              <a
                href="#"
                aria-label="Google"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <i className="fab fa-google" />
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <i className="fab fa-whatsapp" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold">
              Shop
            </h3>

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
            <h3 className="text-sm font-semibold">
              Company
            </h3>

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

          <span>
            Built for better everyday tech.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="w-fit text-sm text-neutral-400 transition hover:text-white"
    >
      {children}
    </Link>
  );
}
