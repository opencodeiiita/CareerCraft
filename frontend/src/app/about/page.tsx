"use client";
import { useEffect, useRef, useState } from 'react';
import { Target, Brain, Users, TrendingUp, ArrowRight, FileText, Search, Zap, GraduationCap, Briefcase } from 'lucide-react';
import './about.css';

export default function AboutPage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Scroll progress for timeline
    useEffect(() => {
        const handleScroll = () => {
            if (timelineRef.current) {
                const rect = timelineRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementTop = rect.top;
                const elementHeight = rect.height;

                if (elementTop < windowHeight && elementTop + elementHeight > 0) {
                    const progress = Math.min(1, Math.max(0, (windowHeight - elementTop) / (windowHeight + elementHeight)));
                    setScrollProgress(progress * 100);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Spotlight effect handler
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className="about-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-gray-900 dark:text-gray-900 dark:text-white relative overflow-hidden">

            {/* ===== HERO SECTION ===== */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20 dark:from-gray-900 dark:via-black dark:to-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-900 dark:text-white">
                            About <span className="text-blue-600">CareerCraft</span>
                        </h1>
                        <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300">
                            Empowering careers through intelligent technology and personalized guidance
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== INTRO SECTION ===== */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card rounded-2xl p-8 sm:p-12 relative"
                        onMouseMove={handleMouseMove}
                        style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
                    >
                        <div className="space-y-6 relative z-10">
                            <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                                <strong className="text-gray-900 dark:text-white font-semibold">CareerCraft</strong> is an AI-powered career assistance platform designed to help individuals build stronger resumes, discover the right job opportunities, and grow professionally with confidence.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                                Our goal is to simplify the job-seeking process by combining smart resume analysis, accurate job matching, and personalized career guidance in one unified platform.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                                CareerCraft empowers students and professionals to understand their strengths, bridge skill gaps, and present themselves effectively in a competitive job market.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider max-w-6xl mx-auto" />

            {/* ===== WHAT MAKES US DIFFERENT - BENTO GRID ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="heading-lg text-center mb-4">
                        <span className="text-gray-900 dark:text-white">What Makes Us </span>
                        <span className="gradient-text">Different</span>
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Built with modern AI and designed for the future of work
                    </p>

                    <div className="bento-grid">
                        {/* Large Card - Our Mission */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card bento-large rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center glow-icon">
                                    <Target className="w-7 h-7 text-gray-900 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our Mission</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        To help job-seekers unlock better opportunities through AI-driven insights and career tools.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Large Card - AI-Powered */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card bento-large rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center glow-icon">
                                    <Brain className="w-7 h-7 text-gray-900 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personalized Analysis</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        We use modern AI and NLP techniques to analyze resumes, match skills, and generate impactful documents.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Regular Card - User First */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card bento-large rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center glow-icon">
                                    <Users className="w-7 h-7 text-gray-900 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User-First Design</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        CareerCraft is built with simplicity and clarity, ensuring an intuitive experience for every user.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Regular Card - Career Growth */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card bento-large rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center glow-icon">
                                    <TrendingUp className="w-7 h-7 text-gray-900 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Career Growth</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        From resume optimization to skill improvement, we support continuous learning and growth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider max-w-6xl mx-auto" />

            {/* ===== PRODUCT PREVIEW ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-lg mb-4">
                            <span className="text-gray-900 dark:text-white">Product </span>
                            <span className="gradient-text">Preview</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Experience the power of AI-driven career tools designed to elevate your professional journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Resume Analysis */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-5 glow-icon">
                                <FileText className="w-6 h-6 text-gray-900 dark:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Resume Analysis</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Get instant feedback on your resume with ATS compatibility checks, keyword optimization, and formatting suggestions.
                            </p>
                            <ul className="space-y-2.5 text-sm">
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> ATS Score Rating
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> Keyword Analysis
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> Actionable Suggestions
                                </li>
                            </ul>
                        </div>

                        {/* Job Matching */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-5 glow-icon">
                                <Search className="w-6 h-6 text-gray-900 dark:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Job Matching</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Discover opportunities that align with your skills, experience, and career goals using our intelligent matching algorithm.
                            </p>
                            <ul className="space-y-2.5 text-sm">
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Skill-based Matching
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Compatibility Scores
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Gap Analysis
                                </li>
                            </ul>
                        </div>

                        {/* Cover Letter Generator */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-5 glow-icon">
                                <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cover Letter Generator</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Create personalized, professional cover letters tailored to specific job descriptions in seconds.
                            </p>
                            <ul className="space-y-2.5 text-sm">
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> AI-Powered Generation
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> Customizable Templates
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> Save & Manage
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider max-w-6xl mx-auto" />

            {/* ===== DESIGNED FOR ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-lg mb-4">
                            <span className="text-gray-900 dark:text-white">Designed </span>
                            <span className="gradient-text">For</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                            CareerCraft serves diverse audiences at every stage of their career journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Students */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card accent-border-blue rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-5">
                                <GraduationCap className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Students & Recent Graduates</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Build your first professional resume, understand industry expectations, and prepare for your career launch with confidence.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                                <li>• Resume templates optimized for entry-level roles</li>
                                <li>• Career guidance and skill recommendations</li>
                                <li>• Interview preparation resources</li>
                            </ul>
                        </div>

                        {/* Professionals */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card accent-border-green rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-5">
                                <Briefcase className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Working Professionals</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Advance your career by optimizing your resume, discovering better opportunities, and staying competitive in your field.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                                <li>• Mid-level to senior resume optimization</li>
                                <li>• Job matching based on experience</li>
                                <li>• Skill gap analysis and upskilling paths</li>
                            </ul>
                        </div>

                        {/* Career Changers */}
                        <div
                            className="rounded-2xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 transition-all duration-300 spotlight-card accent-border-cyan rounded-2xl p-8 relative"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-5">
                                <Zap className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Career Changers</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-5 text-sm leading-relaxed">
                                Transition into a new field by highlighting transferable skills, identifying relevant opportunities, and building a compelling narrative.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                                <li>• Transferable skills identification</li>
                                <li>• Industry transition guidance</li>
                                <li>• Re-branding and positioning support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider max-w-6xl mx-auto" />

            {/* ===== CAREER JOURNEY TIMELINE ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="heading-lg text-center mb-4">
                        <span className="text-gray-900 dark:text-white">Your Career Journey with </span>
                        <span className="gradient-text">CareerCraft</span>
                    </h2>
                    <p className="text-center text-gray-600 dark:text-slate-400 text-lg mb-16">
                        From resume building to landing your dream job
                    </p>

                    <div className="timeline-container relative" ref={timelineRef}>
                        {/* Background Line */}
                        <div className="timeline-line bg-gray-200 dark:bg-blue-900/20" />
                        {/* Progress Line */}
                        <div
                            className="timeline-line-progress"
                            style={{ height: `${scrollProgress}%` }}
                        />

                        <div className="space-y-12 pl-16 sm:pl-20">
                            {/* Step 1 */}
                            <div className="timeline-item relative">
                                <div className="absolute -left-16 sm:-left-20 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                                    1
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Resume</h4>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                    Start by uploading your existing resume. Our AI analyzes it instantly.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="timeline-item relative">
                                <div className="absolute -left-16 sm:-left-20 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg shadow-lg shadow-violet-500/25">
                                    2
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Personalized Insights</h4>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                    Receive detailed feedback on strengths, weaknesses, and improvement areas.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="timeline-item relative">
                                <div className="absolute -left-16 sm:-left-20 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                                    3
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Match with Opportunities</h4>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                    Discover job roles that align perfectly with your skills and experience.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="timeline-item relative">
                                <div className="absolute -left-16 sm:-left-20 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg shadow-lg shadow-orange-500/25">
                                    4
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Grow Continuously</h4>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                    Bridge skill gaps with targeted recommendations and resources.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

                        <div className="relative z-10 p-10 sm:p-16 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                                Ready to Transform Your Career?
                            </h2>
                            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Join thousands of professionals who are building better careers with CareerCraft
                            </p>
                            <button className="group inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl shadow-black/20 hover:scale-105">
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom spacing */}
            <div className="h-8" />
        </div>
    );
}

