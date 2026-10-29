// src/pages/public/About.jsx
// About page matching Figma layout with academic integrity (Haramaya University).

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function About() {
  const missionCards = [
    {
      title: 'Digitized Convenience',
      desc: 'Eliminating the burden of in-person queues, physical paperwork, and manual travel by providing an accessible web interface for clearance applications.',
      stripeColor: 'bg-[#0E8A3E]'
    },
    {
      title: 'Verification Integrity',
      desc: 'Equipping certificates with cryptographic seals, unique serial numbers, and scan-ready QR codes that employers and institutions can check in seconds.',
      stripeColor: 'bg-[#FCCB0B]'
    },
    {
      title: 'Administrative Accountability',
      desc: 'Enforcing role-based access control (RBAC) and immutable audit logging for all reviews, approvals, and credential inspections.',
      stripeColor: 'bg-[#E11D1D]'
    },
    {
      title: 'Academic Innovation',
      desc: 'Demonstrating how contemporary full-stack web technologies (React, Node.js, JWT, bcrypt) can be harnessed for transparent public sector automation.',
      stripeColor: 'bg-[#0F2A6B]'
    }
  ];

  const teamMembers = [
    {
      name: 'Oseid Ebrahim',
      role: 'Project Lead & Full-Stack Developer',
      dept: 'Department of Information Science',
      institution: 'Haramaya University',
      initials: 'OE'
    },
    {
      name: 'Research Team Member',
      role: 'Systems Analysis & UI/UX Design',
      dept: 'Department of Information Science',
      institution: 'Haramaya University',
      initials: 'IS'
    },
    {
      name: 'Academic Advisor',
      role: 'Project Supervision & Evaluation',
      dept: 'Faculty of Computing and Informatics',
      institution: 'Haramaya University',
      initials: 'HU'
    }
  ];

  return (
    <div className="bg-[#F4F6FB] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="w-12 h-1 bg-[#D4A53A] mx-auto rounded-full"></div>
          <span className="inline-block text-xs uppercase tracking-widest font-mono text-blue-200 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30">
            Haramaya University — Graduation Project
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            About EthioClear
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed">
            A graduation project developed by students of Haramaya University, Department of Information Science, showcasing a modern vision for digital criminal record certificate management in Ethiopia.
          </p>
        </div>
      </section>

      {/* 2. INSTITUTIONAL MISSION & OVERVIEW */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="w-10 h-0.5 bg-[#D4A53A]"></div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A6B] dark:text-blue-200">
              Our Vision and Academic Scope
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Obtaining a criminal record clearance certificate in Ethiopia has traditionally involved in-person visits to police bureaus, manual identification checks, long queuing, and multi-day waiting periods for physical paper documents.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            EthioClear was conceived and developed as an <strong>Academic Graduation Project</strong> at <strong>Haramaya University</strong>, Department of Information Science, to demonstrate how an end-to-end digital system can streamline applicant submissions, assist verification officers with structured review queues, and allow instant public verification using QR codes and cryptographically protected serial identifiers.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <p className="font-bold">Important Academic Disclosure:</p>
            <p>
              EthioClear is an independent student prototype built solely for educational and research demonstration purposes. It is not affiliated with, authorized by, or an official service of the Ethiopian Federal Police Commission or any government department.
            </p>
          </div>
        </div>

        {/* 3. FOUR MISSION PILLARS */}
        <div>
          <div className="text-center space-y-3 mb-10">
            <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
            <h3 className="font-serif text-2xl font-bold text-[#0F2A6B] dark:text-blue-200">
              Core Architectural Pillars
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
              Principles guiding the system design and functional implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missionCards.map((card, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-3 hover:shadow-md transition-shadow"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.stripeColor}`}></div>
                <h4 className="font-serif text-lg font-bold text-[#0F2A6B] dark:text-blue-200 pt-1">
                  {card.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RESEARCH & PROJECT TEAM */}
        <div>
          <div className="text-center space-y-3 mb-10">
            <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto rounded-full"></div>
            <h3 className="font-serif text-2xl font-bold text-[#0F2A6B] dark:text-blue-200">
              Project Development Team
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
              Haramaya University • Department of Information Science
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#0F2A6B] text-[#D4A53A] font-serif font-bold text-lg flex items-center justify-center shadow-inner">
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-xs font-medium text-[#D4A53A]">
                    {member.role}
                  </p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>{member.dept}</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">{member.institution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 5. CTA BAND */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Explore the Prototype Architecture
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Review the application workflow, test the verification engine, or examine the role-based management interfaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/how-it-works">
              <Button size="lg" className="bg-[#D4A53A] hover:bg-[#b88c2b] text-slate-900 font-semibold border-none px-7">
                See How It Works
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-7">
                Contact the Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;