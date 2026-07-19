import { ShieldCheck, MapPin, MessageCircle, Star, ArrowLeftRight, Play, CheckCheck, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ── Static product data for Trending section ── */
const trendingItems = [
  {
    id: "1",
    title: "MacBook Air M1",
    mode: "rent" as const,
    priceLabel: "₹499",
    priceSuffix: "/ day",
    college: "Hindu College",
    rating: 4.8,
    reviews: 32,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400&fmt=webp",
    badge: "For Rent",
  },
  {
    id: "2",
    title: "iPhone 12 128GB",
    mode: "buy" as const,
    priceLabel: "₹32,999",
    priceSuffix: "",
    college: "SRCC",
    rating: 4.6,
    reviews: 18,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=400&fmt=webp",
    badge: "For Sale",
  },
  {
    id: "3",
    title: "Study Table",
    mode: "rent" as const,
    priceLabel: "₹299",
    priceSuffix: "/ month",
    college: "Miranda House",
    rating: 4.3,
    reviews: 75,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400",
    badge: "For Rent",
  },
  {
    id: "4",
    title: "Physics Textbook Set",
    mode: "buy" as const,
    priceLabel: "₹499",
    priceSuffix: "",
    college: "Hindu College",
    rating: 4.7,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
    badge: "For Sale",
  },
  {
    id: "5",
    title: "Royal Enfield Classic 350",
    mode: "rent" as const,
    priceLabel: "₹799",
    priceSuffix: "/ day",
    college: "LSR",
    rating: 4.5,
    reviews: 9,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=400",
    badge: "For Rent",
  },
  {
    id: "6",
    title: "Samsung Refrigerator",
    mode: "buy" as const,
    priceLabel: "₹11,999",
    priceSuffix: "",
    college: "NSUT",
    rating: 4.3,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=400",
    badge: "For Sale",
  },
  {
    id: "7",
    title: "Nike Running Shoes",
    mode: "buy" as const,
    priceLabel: "₹2,499",
    priceSuffix: "",
    college: "Delhi University",
    rating: 4.6,
    reviews: 16,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
    badge: "For Sale",
  },
  {
    id: "8",
    title: "Volleyball",
    mode: "rent" as const,
    priceLabel: "₹59",
    priceSuffix: "/ day",
    college: "SRCC",
    rating: 4.4,
    reviews: 8,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=400",
    badge: "For Rent",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8">
      {/* ══════ HERO ══════ */}
      <section className="relative grid lg:grid-cols-2 gap-8 items-center min-h-[620px]">
        {/* Left */}
        <div className="flex flex-col z-10 py-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit mb-6 text-xs font-semibold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            Student-only marketplace
          </div>

          <h1 className="font-[var(--font-heading)] text-5xl md:text-[68px] font-extrabold leading-[1.08] text-foreground tracking-tight mb-5">
            Rent. Buy. Connect.<br />
            Only on <span className="text-primary">Campus.</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-[420px] mb-9 leading-relaxed">
            Join thousands of verified students renting and buying from nearby colleges.
          </p>

          {/* Feature Icons */}
          <div className="flex flex-wrap gap-7 mb-9">
            {[
              { icon: ShieldCheck, label: "Student Verified\nOnboarding" },
              { icon: ArrowLeftRight, label: "Rent / Buy\nSwitch" },
              { icon: MapPin, label: "Campus Radius\nDiscovery" },
              { icon: MessageCircle, label: "Chat-First\nTransactions" },
              { icon: Star, label: "Trust Score &\nRatings (Soon)" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5 w-[72px]">
                <div className="h-11 w-11 rounded-xl bg-surface border flex items-center justify-center text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium leading-tight whitespace-pre-line">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition shadow-floating text-sm"
            >
              Explore Near You
              <MapPin className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 bg-white dark:bg-surface text-foreground font-semibold px-7 py-3.5 rounded-xl border hover:bg-muted transition text-sm"
            >
              How It Works
              <Play className="h-4 w-4 text-primary" />
            </Link>
          </div>
        </div>

        {/* Right – Composition */}
        <div className="relative h-full w-full min-h-[580px] hidden lg:block">
          {/* Background arch with campus photo */}
          <div className="absolute top-0 right-0 w-[95%] h-[520px] rounded-t-[260px] overflow-hidden border border-border/60">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"
              alt="University campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>

          {/* Students image (bottom, overlapping arch) */}
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700&h=500"
            alt="Students chatting"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[360px] object-cover object-top rounded-t-3xl z-10 shadow-2xl"
          />

          {/* ── Floating Card: MacBook ── */}
          <div className="absolute top-12 -left-6 bg-white dark:bg-surface p-3.5 rounded-2xl shadow-floating border flex flex-col gap-1.5 z-20 w-52">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-sm text-foreground">MacBook Air M1</span>
              <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">For Rent</span>
            </div>
            <div className="bg-muted rounded-xl h-20 w-full flex items-center justify-center p-2">
              <img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=200&fmt=webp" className="h-full object-contain" alt="Laptop" />
            </div>
            <div className="font-bold text-foreground text-sm">₹499 <span className="text-[11px] font-normal text-muted-foreground">/ day</span></div>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>Hindu College</span>
              <span className="flex items-center text-amber-500 font-semibold"><Star className="h-3 w-3 fill-amber-500 mr-0.5" /> 4.8 (32)</span>
            </div>
          </div>

          {/* ── Floating Chat: Incoming ── */}
          <div className="absolute top-16 right-2 bg-white dark:bg-surface p-3.5 rounded-2xl rounded-br-sm shadow-floating border z-20 w-56">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-muted border overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" alt="Rahul" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground leading-tight">Rahul</span>
                <span className="text-[9px] text-green-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500" /> Active now</span>
              </div>
            </div>
            <p className="text-xs text-foreground bg-muted p-2.5 rounded-xl rounded-tl-sm">Hey! Is this available for rent?</p>
            <div className="text-[9px] text-muted-foreground text-right mt-1">11:30 AM</div>
          </div>

          {/* ── Floating Chat: Reply (purple) ── */}
          <div className="absolute top-52 right-4 bg-primary p-3.5 rounded-2xl rounded-br-sm shadow-floating z-20 w-52">
            <p className="text-xs text-white">Yes, it is! We can meet at the library.</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] text-white/70">11:32 AM</span>
              <CheckCheck className="h-2.5 w-2.5 text-white/70" />
            </div>
          </div>

          {/* ── Floating Card: Camera ── */}
          <div className="absolute bottom-4 right-0 bg-white dark:bg-surface p-3.5 rounded-2xl shadow-floating border flex flex-col gap-1.5 z-20 w-52">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-sm text-foreground">DSLR Camera Canon</span>
              <span className="text-[9px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">For Sale</span>
            </div>
            <div className="bg-muted rounded-xl h-20 w-full flex items-center justify-center p-2">
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200" className="h-full object-contain" alt="Camera" />
            </div>
            <div className="font-bold text-foreground text-sm">₹18,999</div>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>SRCC</span>
              <span className="flex items-center text-amber-500 font-semibold"><Star className="h-3 w-3 fill-amber-500 mr-0.5" /> 4.6 (28)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ COLLEGES BAR ══════ */}
      <section className="mt-10 bg-muted/40 rounded-2xl py-5 px-6 border flex flex-col md:flex-row items-center gap-4">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Join thousands of verified students trading across top colleges</span>
        <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start flex-1">
          {["Delhi University", "Hindu College", "SRCC", "Miranda House", "LSR", "NSUT"].map((name, i) => (
            <div key={name} className="flex items-center gap-1.5 opacity-70">
              <div className={`w-5 h-5 rounded-full ${["bg-primary/30","bg-amber-500/30","bg-blue-500/30","bg-green-500/30","bg-pink-500/30","bg-orange-500/30"][i]}`} />
              <span className="font-bold text-xs text-foreground">{name}</span>
            </div>
          ))}
          <span className="text-primary font-bold text-xs">and more…</span>
        </div>
      </section>

      {/* ══════ TRENDING NEAR YOU ══════ */}
      <section className="mt-16" id="trending">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">Trending Near You</h2>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <MapPin className="h-3 w-3" />
              Within 5 km
            </div>
          </div>
          <Link href="/browse" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-3">
          {["All","Electronics","Furniture","Books","Bikes","Appliances","Fashion","Sports"].map((cat, i) => (
            <Link
              key={cat}
              href={i === 0 ? "/browse" : `/browse?category=${cat.toLowerCase()}`}
              className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                i === 0
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-surface border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </Link>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-1.5">
            <button className="p-2 rounded-full border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-2 rounded-full border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {trendingItems.map((item) => (
            <Link key={item.id} href={`/browse/${item.id}`} className="group">
              <article className="bg-white dark:bg-surface rounded-2xl border overflow-hidden shadow-sm hover:shadow-floating transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 bg-muted flex items-center justify-center p-4">
                  <img src={item.image} alt={item.title} className="h-full max-w-full object-contain" />
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.mode === "rent" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
                  }`}>
                    {item.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition truncate">{item.title}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-bold text-foreground">{item.priceLabel}</span>
                    {item.priceSuffix && <span className="text-xs text-muted-foreground">{item.priceSuffix}</span>}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground">
                    <span>{item.college}</span>
                    <span className="flex items-center text-amber-500 font-semibold">
                      <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                      {item.rating} ({item.reviews})
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <button className="p-2 rounded-lg border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${n === 1 ? "bg-primary text-white" : "border bg-white dark:bg-surface hover:bg-muted text-foreground"}`}>
              {n}
            </button>
          ))}
          <span className="text-muted-foreground text-sm mx-1">…</span>
          <button className="w-9 h-9 rounded-lg text-sm font-medium border bg-white dark:bg-surface hover:bg-muted text-foreground">20</button>
          <button className="p-2 rounded-lg border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}
