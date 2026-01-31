import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Reusable animated section wrapper
const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
          >
            FacilTrack
          </motion.h1>

          <div className="hidden md:flex items-center space-x-10">
            {['Features', 'Solutions', 'Pricing', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/buildings"
                  className="px-5 py-2.5 text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-600 hover:border-red-400 hover:text-red-400 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-600 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Automate Building Compliance
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-300 mt-3 block">with Zero Manual Effort</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Daily voltage checks, chiller temps, lift logs, water usage — all captured, scheduled, approved, and visualized automatically. For facility managers who want control, not paperwork.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xl font-bold shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105 transition-all duration-400"
              >
                Start Free Trial
              </Link>
              <button className="px-10 py-5 bg-transparent border-2 border-gray-600 rounded-full text-xl font-bold hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </AnimatedSection>

          {/* Trust badges / stats */}
          <AnimatedSection delay={0.9}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: '500+', label: 'Buildings Monitored' },
                { num: '10k+', label: 'Readings / Month' },
                { num: '98%', label: 'Approval Rate' },
                { num: '24/7', label: 'Live Dashboards' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="glass px-6 py-8 rounded-2xl border border-white/10 backdrop-blur-lg"
                >
                  <div className="text-4xl font-bold text-cyan-400">{stat.num}</div>
                  <div className="text-gray-400 mt-2 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Built for Real Facility Teams
            </h2>
            <p className="mt-6 text-xl text-gray-400 text-center max-w-3xl mx-auto">
              From admin setup to technician mobile submissions — everything is fast, secure, and auditable.
            </p>
          </AnimatedSection>

          <div className="mt-20 grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Smart Scheduling',
                desc: 'Set daily, weekly or custom times for voltage, temp, usage checks. Auto-reminders to technicians.',
                icon: '🕒',
              },
              {
                title: 'Approval Workflow',
                desc: 'Technicians submit → Supervisors/Admins review, reject or comment. Nothing goes live without quality check.',
                icon: '✅',
              },
              {
                title: 'Live Analytics & Graphs',
                desc: 'Trends, alerts, historical charts for chillers, lifts, ACs, networks — spot issues before they escalate.',
                icon: '📈',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
                className="glass p-10 rounded-3xl border border-white/10 backdrop-blur-xl group hover:border-cyan-500/50 transition-colors duration-500"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-cyan-900/30"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
              Stop Chasing Paper. Start Tracking Smart.
            </h2>
            <p className="mt-8 text-2xl text-gray-300 max-w-3xl mx-auto">
              Join hundreds of facility teams who replaced binders with real-time visibility.
            </p>

            <div className="mt-12">
              <Link
                to="/register"
                className="inline-block px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-full text-2xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-400"
              >
                Claim Your Free Org Today
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} FacilTrack — All rights reserved.
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-cyan-400">Privacy</a>
            <a href="#" className="hover:text-cyan-400">Terms</a>
            <a href="#" className="hover:text-cyan-400">Support</a>
          </div>
        </div>
      </footer>

      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        .animate-pulse {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
