import { Link } from "react-router-dom";
import { generalPagePadding } from "../../utils/constants";

function AboutUs() {
  return (
    <main className="bg-white text-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className={`${generalPagePadding} py-24 md:py-32`}>
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-secondary" />

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                About us
              </p>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
              Technology that fits
              <br />
              <span className="text-secondary">into everyday life.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              We make it easier to discover quality electronics from brands
              you can trust — without making the buying experience complicated.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className={`${generalPagePadding} py-20 md:py-28`}>
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Who we are
            </p>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              A simpler way to shop for tech.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 md:text-base">
            <p>
              We are an electronics store focused on bringing useful,
              dependable technology closer to everyday people.
            </p>

            <p>
              From headphones and speakers to laptops, smartphones,
              accessories and home electronics, we curate products that are
              designed to be useful beyond the excitement of the purchase.
            </p>

            <p>
              Our goal is simple: give you a straightforward place to discover
              products, understand what you are buying, and make confident
              choices.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className={`${generalPagePadding} pb-20 md:pb-28`}>
        <div className="grid overflow-hidden rounded-3xl bg-neutral-100 md:grid-cols-2">
          <div className="relative min-h-[350px] md:min-h-[500px]">
            <img
              src="/images/pxfuel.jpg"
              alt="Technology and electronics"
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-6 left-6 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-black">
              Technology for everyday life
            </div>
          </div>

          <div className="flex items-center p-8 md:p-14 lg:p-20">
            <div className="max-w-lg">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                What matters to us
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Good products.
                <br />
                Clear choices.
                <br />
                Better experiences.
              </h2>

              <p className="mt-6 text-sm leading-7 text-neutral-600 md:text-base">
                Technology should make life easier, not make shopping for it
                harder. That is why we focus on presenting products clearly,
                keeping the experience simple, and helping customers find
                technology that actually fits their needs.
              </p>

              <div className="mt-8 h-1 w-12 rounded-full bg-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-950 text-white">
        <div className={`${generalPagePadding} py-20 md:py-28`}>
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Our values
            </p>

            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              What we believe in.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-black">
                01
              </div>

              <h3 className="mt-8 text-xl font-semibold">Quality</h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                We believe the products you buy should provide genuine value
                and stand up to everyday use.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-black">
                02
              </div>

              <h3 className="mt-8 text-xl font-semibold">Simplicity</h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Finding and buying technology should feel straightforward,
                intuitive and stress-free.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-black">
                03
              </div>

              <h3 className="mt-8 text-xl font-semibold">Trust</h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                We want every interaction with our store to be clear,
                reliable and worthy of your confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${generalPagePadding} py-20 md:py-28`}>
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-14 md:px-14 md:py-20">
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-black/50">
                Ready to explore?
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-black md:text-5xl">
                Find the technology
                <br />
                that works for you.
              </h2>
            </div>

            <Link
              to="/categories"
              className="inline-flex w-fit items-center rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Explore products
              <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Decorative element */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[40px] border-black/5" />
        </div>
      </section>
    </main>
  );
}

export default AboutUs;