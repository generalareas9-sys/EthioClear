// src/pages/public/HowItWorks.jsx
// How It Works guide page matching Figma layout with academic prototype transparency.

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function HowItWorks() {
  const steps = [
    {
      num: 'STEP 01',
      title: 'Create Account & Submit Application',
      desc: 'Register with your verified email and phone number. Fill out the criminal clearance application form with your personal identification and required document uploads.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    },
    {
      num: 'STEP 02',
      title: 'Verification Officer Review',
      desc: 'Assigned verification officers examine submitted records, cross-check identity details against the database, and verify the authenticity of provided evidence.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    {
      num: 'STEP 03',
      title: 'Digital Signature & QR Generation',
      desc: 'Once approved, the system automatically mints a secure cryptographic verification code and QR code, sealing the record against unauthorized tampering.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    {
      num: 'STEP 04',
      title: 'Instant Online Verification',
      desc: 'Third-party organizations, employers, or academic institutions can instantly verify the authenticity of the clearance certificate via the public verification portal.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
    }
  ];

  const requirements = [
    {
      title: 'Valid Government ID',
      desc: 'Kebele ID, Ethiopian Passport, or Driver’s License with clear front and back scans.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'Recent Passport Photo',
      desc: 'Clear, high-resolution portrait photograph with a plain white or light background.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'Application Form',
      desc: 'Accurate biographical details including full legal name, date of birth, and place of birth.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Valid Contact Info',
      desc: 'Active phone number and personal email address for status notifications and verification.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const faqs = [
    {
      q: 'Is this an official government service?',
      a: 'No. EthioClear is an academic research prototype developed at Haramaya University, Department of Information Science. It demonstrates modern electronic governance and verification capabilities for educational and research purposes.'
    },
    {
      q: 'How long does verification take in this prototype?',
      a: 'In this demonstration system, applications are reviewed by authorized student and faculty test officers within simulated queue periods, typically ready within 1 to 2 review cycles.'
    },
    {
      q: 'How are clearance certificates verified?',
      a: 'Each certificate generated by the system embeds a unique alphanumeric verification reference and QR code. Anyone can enter the reference on the "Verify Certificate" page to view the authentic issuing record.'
    },
    {
      q: 'What technologies power the system security?',
      a: 'The system utilizes industry-standard cryptographic techniques including bcrypt password hashing, JSON Web Tokens (JWT) for session authentication, role-based access control (RBAC), and persistent audit trails.'
    }
  ];

  return (
    <div className="bg-[#F4F6FB] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="w-12 h-1 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            How EthioClear Works
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed">
            A step-by-step walkthrough of the digital application, officer review, tamper-proof certificate generation, and public verification workflow.
          </p>
        </div>
      </section>

      {/* Step by Step Sequence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-14 space-y-3">
          <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A6B] dark:text-blue-300">
            Four Steps to Digital Verification
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            From initial registration to instant employer verification, every stage is fully digitized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${step.color}`}>
                  {step.icon}
                </div>
                <span className="font-mono text-xs font-semibold text-[#D4A53A] tracking-wider uppercase">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-[#0F2A6B] dark:text-blue-200">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What You'll Need */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A6B] dark:text-blue-300">
              What You Will Need
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
              Ensure you have the following information and documents ready before starting your application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F4F6FB] dark:bg-slate-950/60 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-[#0F2A6B] dark:text-blue-300 flex items-center justify-center">
                  {req.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{req.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 space-y-3">
          <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A6B] dark:text-blue-300">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Answers to common questions regarding the EthioClear academic prototype.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-[#0F2A6B] dark:text-blue-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">?</span>
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Band */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Experience the Demonstration?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Create an applicant account to test the complete application process, or test the verification scanner with a sample certificate code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-[#D4A53A] hover:bg-[#b88c2b] text-slate-900 font-semibold border-none px-7">
                Apply Now — Demo
              </Button>
            </Link>
            <Link to="/verify">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-7">
                Verify a Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HowItWorks;