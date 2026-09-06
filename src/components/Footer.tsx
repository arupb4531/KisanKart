import Link from 'next/link';
import { Sprout, ShieldCheck, Heart, ArrowRight, Sparkles, MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-forest-900/60 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Producer Callout Banner */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-slate-900 rounded-3xl p-8 sm:p-10 mb-14 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRODUCER EMPOWERMENT INITIATIVE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              Are you an organic grower or dairy producer?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 font-light leading-relaxed">
              Eliminate middlemen and commission agents. List your daily harvest at direct farm-gate prices with guaranteed next-day morning dispatch.
            </p>
          </div>
          <Link
            href="/register?role=farmer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-glow-emerald hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span>Register as Producer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white font-display leading-none">
                  Kisan<span className="text-emerald-400">Kart</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                  Farm to Table
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Next-generation direct-to-consumer agricultural network connecting Indian farmers with conscious urban households. Zero markups, 100% freshness traceability.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified Grower & Bio-Certified Traceability</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-display">
              Produce Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link href="/marketplace?category=vegetables" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>🥦 Vine-Fresh Vegetables</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=fruits" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>🥭 Tree-Ripened Orchard Fruits</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=dairy" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>🥛 Raw A2 Gir Cow Milk & Vedic Ghee</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=grains" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>🌾 Heritage Grains & Cold-Pressed Oils</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?isOrganic=true" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span>🌿 100% Certified Organic Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Producer & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-display">
              For Producers & Logistics
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link href="/dashboard/farmer" className="hover:text-emerald-300 transition-colors">
                  Farmer Fulfillment Desk
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-300 transition-colors">
                  Apply for Land & Bio Verification
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-emerald-300 transition-colors">
                  Platform Governance & Verification Desk
                </Link>
              </li>
              <li>
                <span className="text-emerald-400/60 text-[11px] font-semibold">
                  Zero Intermediary Commissions (100% Payout)
                </span>
              </li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-display">
              Agri Support Hub
            </h4>
            <p className="text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Pune (Saswad Corridor) & Nashik (Dindori Valley) Hubs</span>
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-white">+91 (020) 2440-9988</span>
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>support@kisankart.org</span>
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-medium">
          <div>
            © {new Date().getFullYear()} KisanKart Agri Grid. Built for Indian Farmers & Consumers.
          </div>
          <div className="flex items-center gap-4">
            <span>Direct Sourcing Guarantee</span>
            <span>•</span>
            <span>Organic Certified Standards</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
