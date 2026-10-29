// src/pages/public/Landing.jsx
// Full Figma-matching Public Home page for EthioClear with honest academic prototype claims.

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Logo from '../../components/common/Logo.jsx';

function Landing() {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Register & Apply',
      desc: 'Create your account, fill in your personal information, and submit your application with the required supporting documents.',
      icon: (
        <svg className="w-6 h-6 text-[#0F2A6B] dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      step: 'STEP 02',
      title: 'Officer Review',
      desc: 'A trained verification officer reviews your application and documents, verifying your identity and checking official databases.',
      icon: (
        <svg className="w-6 h-6 text-[#0F2A6B] dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      step: 'STEP 03',
      title: 'Verify & Download',
      desc: 'Once approved, download your digitally sealed clearance record with an alphanumeric verification code and QR for instant confirmation.',
      icon: (
        <svg className="w-6 h-6 text-[#0F2A6B] dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const features = [
    {
      title: 'Secure Authentication',
      desc: 'Industry-standard bcrypt password hashing, JSON Web Tokens (JWT), and role-based access control protect user data and system state.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Tamper-Evident Records',
      desc: 'Every certificate carries an individual verification identifier and QR code that can be validated by employers online in seconds.',
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      color: 'bg-blue-50 dark:bg-blue-950/40'
    },
    {
      title: 'Real-Time Tracking',
      desc: 'Monitor your clearance progress at every step: from submission to review queue, with live status updates and notifications.',
      icon: (
        <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-50 dark:bg-amber-950/40'
    },
    {
      title: 'Fully Digital Workflow',
      desc: 'No paper forms or physical office queues. Apply online, upload identification, and access verification tools from any device.',
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-50 dark:bg-purple-950/40'
    },
    {
      title: 'Role-Based Portals',
      desc: 'Dedicated interfaces tailored specifically for Applicants, Verification Officers, and System Administrators with granular controls.',
      icon: (
        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-cyan-50 dark:bg-cyan-950/40'
    },
    {
      title: 'Audit & Accountability',
      desc: 'Every administrative decision and verification query is recorded in an audit trail for system integrity and operational transparency.',
      icon: (
        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-rose-50 dark:bg-rose-950/40'
    }
  ];

  return (
    <div className="bg-[#F4F6FB] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2A6B] via-[#123580] to-[#1E3A8A] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Academic Prototype Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/60 border border-blue-400/30 px-3.5 py-1 text-xs text-blue-200 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#D4A53A] animate-pulse"></span>
              <span>University Graduation Project — Academic Prototype</span>
            </div>

            {/* Serif Headline with gold accent */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Your Criminal Record <br />
              <span className="text-[#D4A53A]">Certificate, Digitized.</span>
            </h1>

            {/* Subheading */}
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
              EthioClear demonstrates how Ethiopian citizens could apply for, track, and receive criminal record clearance certificates securely online — no queues, no paperwork, no delays.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#D4A53A] hover:bg-[#c29631] text-slate-950 font-bold border-none shadow-lg px-8 py-3.5"
                >
                  Apply Now — Demo
                </Button>
              </Link>
              <Link to="/verify">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/60 text-white hover:bg-white/10 font-medium px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Verify a Certificate
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Sample Certificate Preview Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Floating "Approved" Notification Chip */}
            <div className="absolute -top-4 -left-3 sm:-left-6 z-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Approved!</div>
                <div className="text-[10px] text-slate-500">2 min ago</div>
              </div>
            </div>

            {/* Certificate Card Mockup */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-blue-200/40 relative overflow-hidden">
              {/* National Ribbon Stripe across top */}
              <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-5">
                <div className="w-1/3 bg-[#0E8A3E]"></div>
                <div className="w-1/3 bg-[#FCCB0B]"></div>
                <div className="w-1/3 bg-[#E11D1D]"></div>
              </div>

              {/* Certificate Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Certificate Preview</span>
                  <div className="font-serif text-lg font-bold text-[#0F2A6B]">EthioClear Clearance</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Certificate Data Fields */}
              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Certificate No.</span>
                  <span className="font-mono font-semibold text-slate-800">ECRC-2026-889234</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-900">ABEBE BEKELE TADESSE</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="text-slate-700">15 March 1988</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Place of Birth</span>
                  <span className="text-slate-700">Addis Ababa</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="text-slate-700">20 October 2026</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Valid Until</span>
                  <span className="text-slate-700">19 October 2027</span>
                </div>
              </div>

              {/* Status pill watermark: Honest Prototype declaration */}
              <div className="mt-3 p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/60 text-center">
                <span className="text-xs font-semibold text-blue-900 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Sample / For Demonstration Purposes Only
                </span>
              </div>

              {/* Mockup QR Barcode footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="font-mono">VERIFY: ECRC-2026-889234</span>
                </div>
                <span className="text-[10px] text-slate-400">Haramaya Uni Prototype</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. STATS STRIP (White band with honest prototype / research metrics) */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-300">
              Prototype
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Demo Environment
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-300">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Digital & Paperless
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-300">
              &lt; 24h
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Simulated Turnaround
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-300">
              JWT + QR
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Tamper-Evident Tech
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE-STEP PROCESS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="w-12 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-200">
            Simple. Fast. Secure.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Get your criminal record clearance certificate in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 border-t-4 border-t-[#0F2A6B] flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                  {st.icon}
                </div>
                <span className="font-mono text-xs font-semibold text-[#D4A53A] tracking-wider uppercase block">
                  {st.step}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0F2A6B] dark:text-blue-100">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/how-it-works">
            <Button variant="outline" className="text-[#0F2A6B] dark:text-blue-300 border-[#0F2A6B]/30 hover:bg-[#0F2A6B]/5 font-semibold text-xs px-6 py-2.5 inline-flex items-center gap-2">
              Learn More About the Process
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. SIX FEATURE CARDS */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <div className="w-12 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-200">
              Built for Trust and Efficiency
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Every feature is designed to make the clearance verification workflow transparent, reliable, and auditable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-[#F4F6FB]/50 dark:bg-slate-950/40 space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-[#0F2A6B] dark:text-blue-100">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DESIGNED FOR PUBLIC TRUST (2-column layout: bullets on left, 2x2 grid on right) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission & Trust statement */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="w-12 h-0.5 bg-[#D4A53A]"></div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2A6B] dark:text-blue-200">
              Designed for Public Trust
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              EthioClear was conceptualized with digital accountability at its core. Every interaction — from document submission to officer verification — is tracked in a transparent audit ledger.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Bcrypt cryptographic password hashing & authenticated sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Role-based access separation for Applicants, Officers, and Admins</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Publicly verifiable certificate codes via dedicated verification scanner</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Tamper-evident audit logs recording all review and issuing events</span>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Grid of Small Icon Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Session Security</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">JWT Token Protected</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Role-Based Access</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Strict RBAC Controls</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Audit Logging</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Every Action Logged</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">QR Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant Authenticity</p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BAND */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Explore the Platform?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Register a simulated applicant account to experience the full clearance application journey, or test the verification scanner.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-[#D4A53A] hover:bg-[#c29631] text-slate-950 font-bold border-none px-8 py-3.5 shadow-lg">
                Apply Now — Demo
              </Button>
            </Link>
            <Link to="/verify">
              <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 font-medium px-8 py-3.5">
                Verify a Certificate
              </Button>
            </Link>
          </div>
          <p className="text-[11px] text-blue-200/80 pt-4 max-w-lg mx-auto">
            EthioClear is an academic research prototype created at Haramaya University, Department of Information Science.
          </p>
        </div>
      </section>

    </div>
  );
}

export default Landing;