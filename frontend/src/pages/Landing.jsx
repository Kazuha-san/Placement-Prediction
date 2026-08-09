import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowRight, Sparkles, ShieldCheck, LineChart, ClipboardList, GraduationCap } from 'lucide-react';

const Landing = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  // Guests and authenticated users see the same Landing page —
  // no auto-redirect. They choose "Get started" like anyone else.
  useEffect(() => {
    if (user) {
      // Only fully authenticated users skip straight past the marketing page.
      navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="page-enter">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="hero-wash absolute inset-0" />

        {/* Layered diagonal panels — echoes the reference's faceted, angular light bands
            rather than a soft blurred blob. Each panel is a hard-edged clipped shard at
            a shared angle, alternating warm/cool tints and opacities for depth. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(0% 0%, 22% 0%, 8% 100%, 0% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))',
          }} />
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(26% 0%, 40% 0%, 26% 100%, 12% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0))',
          }} />
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(46% 0%, 62% 0%, 48% 100%, 32% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))',
          }} />
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(68% 0%, 80% 0%, 66% 100%, 54% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0))',
          }} />
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(86% 0%, 100% 0%, 92% 100%, 78% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
          }} />
        </div>

        <nav className="relative z-10 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            Placement Predictions
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/signin')}
              className="btn-secondary text-sm font-medium px-5 py-2"
            >
              Sign in
            </button>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-28 text-center flex flex-col items-center">
          <span className="chip text-xs font-semibold tracking-wide uppercase px-4 py-1.5 mb-6 inline-flex items-center gap-1.5">
            <Sparkles size={14} /> Know where you stand
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-ink tracking-tight leading-[1.05] mb-6">
            Placement Predictions
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-xl mb-10">
            A quick, honest read on your placement odds — based on your own
            academics, projects and skills. No guesswork, just a clear starting point.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="btn-primary font-semibold text-lg px-8 py-4 flex items-center gap-2 group"
          >
            Get started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ---------- ABOUT & HOW IT WORKS ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-4">
            What this actually is
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            You enter the things that matter — your CGPA, internships,
            projects, aptitude score and a few more — and get back a
            confidence read on your placement chances, plus the factors
            pulling it up or down. It's a mirror, not a verdict.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Fill in your details', body: 'Academics, experience and skills — entered once, in a form that isn\u2019t intimidating.' },
              { step: '2', title: 'Get your prediction', body: 'A confidence score and the specific factors shaping it, right away.' },
              { step: '3', title: 'Track your progress', body: 'Sign in to save every attempt and watch your confidence trend over time.' },
            ].map((s) => (
              <div key={s.step} className="surface-card p-6">
                <span className="font-display text-3xl font-semibold text-muted/50">{s.step}</span>
                <h3 className="font-display text-xl font-semibold text-ink mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY IT HELPS (third section) ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="surface-card p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="chip p-5 shrink-0">
            <GraduationCap size={36} />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3">
              Built for the run-up to placement season
            </h2>
            <p className="text-muted leading-relaxed">
              Most students only find out where they stand when it's too late
              to change it. This gives you that read early — so a low score on
              aptitude or a missing internship is something you can still act on,
              not just something you find out about afterwards.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-semibold text-ink">Placement Predictions</span>
          <span className="text-sm text-muted">Estimates only — not a guarantee of outcome.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
