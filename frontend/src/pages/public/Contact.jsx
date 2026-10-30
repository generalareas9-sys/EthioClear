// src/pages/public/Contact.jsx
// Contact page matching Figma layout with honest academic contact info & prototype inquiry form.

import { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-[#F4F6FB] min-h-screen text-slate-800 transition-colors">
      
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-12 h-1 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Contact Project Team
          </h1>
          <p className="max-w-xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed">
            Have questions about the EthioClear academic prototype, research architecture, or university evaluation? Reach out to our development team.
          </p>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & FORM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-0.5 bg-[#D4A53A]"></div>
              <h2 className="font-serif text-2xl font-bold text-[#0F2A6B]">
                Contact Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                EthioClear is maintained as a graduation project at Haramaya University, Harar, Ethiopia.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              
              {/* Phone */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0F2A6B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Direct Phone</h3>
                  <a href="tel:0986446282" className="text-base font-bold text-[#0F2A6B] hover:underline">
                    0986446282
                  </a>
                  <p className="text-[11px] text-slate-500">Available during university hours</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Direct Inquiries</h3>
                  <a href="mailto:oseidebrahim@gmail.com" className="text-base font-bold text-[#0F2A6B] hover:underline">
                    oseidebrahim@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500">Fastest response for project inquiries</p>
                </div>
              </div>

              {/* Campus Address */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Academic Institution</h3>
                  <p className="text-sm font-bold text-slate-800">
                    Haramaya University
                  </p>
                  <p className="text-xs text-slate-600">
                    Department of Information Science, Harar, Ethiopia
                  </p>
                </div>
              </div>

            </div>

            {/* Prototype notice box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
              <strong className="block mb-1">Academic Prototype Clarification:</strong>
              This inbox is monitored for graduation project evaluation and research feedback. We do not provide official police clearance services.
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#0F2A6B] mb-2">
              Send a Demonstration Message
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Fill out the message form below to share inquiries or feedback with the research team.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-bold text-base text-emerald-900">Message Received (Prototype Mode)</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for your feedback! Since this is an academic prototype demonstration, please contact directly via <a href="mailto:oseidebrahim@gmail.com" className="underline font-semibold">oseidebrahim@gmail.com</a> for real-time correspondence.
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Your Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Full name" 
                    required 
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
                <Input 
                  label="Subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="e.g. Prototype Feedback, Research Inquiry" 
                  required 
                />
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-slate-700 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your feedback or questions here…"
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0F2A6B] focus:outline-none focus:ring-1 focus:ring-[#0F2A6B]"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  fullWidth 
                  className="bg-[#0F2A6B] hover:bg-[#1e3a8a] text-white font-semibold py-3"
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default Contact;