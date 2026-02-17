// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  const isAuthenticated = !!localStorage.getItem("access");
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 lg:pt-32 lg:pb-40 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Design <span className="text-blue-600">production-grade</span> systems faster
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Describe your idea in plain English — get complete architecture diagrams, scalability math, cost estimates, trade-offs, and failure modes in minutes.
          </p>

          <p className="mt-6 text-lg text-gray-500">
            Built for engineers and teams who ship fast and sleep better.
          </p>

          {/* Primary CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/analyze">
              <button className="w-full sm:w-auto px-10 py-5 text-xl font-semibold rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] transition-all duration-200">
                Start Free Analysis →
              </button>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/login">
                <button className="w-full sm:w-auto px-10 py-5 text-xl font-semibold rounded-full border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Social proof / trust signals */}
          <div className="mt-16 text-gray-500 text-sm md:text-base">
            <p>
              Trusted by developers building the next generation of scalable products
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-8 text-sm opacity-80">
              <span>High-traffic APIs</span>
              <span>Microservices</span>
              <span>Event-driven systems</span>
              <span>Distributed databases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick value propositions (3 cards) */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Scalability-first
            </h3>
            <p className="text-gray-600 text-lg">
              Get real numbers: RPS, latency targets, sharding strategy, caching layers, queue sizing — all calculated for your load.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trade-offs exposed
            </h3>
            <p className="text-gray-600 text-lg">
              Monolith vs microservices, SQL vs NoSQL, eventual vs strong consistency — clear pros/cons tailored to your use case.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for production
            </h3>
            <p className="text-gray-600 text-lg">
              Observability, security, cost estimation, rollback plans, CI/CD hooks — everything a senior engineer would include.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-700 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to design something great?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Start your first analysis in 30 seconds — no credit card needed.
          </p>

          <Link to="/analyze">
            <button className="px-12 py-6 text-2xl font-semibold bg-white text-blue-700 rounded-full shadow-2xl hover:bg-gray-100 active:scale-[0.98] transition-all duration-200">
              Begin Now →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
