"use client";
import { Target, Brain, Users, TrendingUp, ArrowRight } from 'lucide-react';
import './about.css';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                            About <span className="text-blue-600">CareerCraft</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Empowering careers through intelligent technology and personalized guidance
                        </p>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 space-y-6 border border-gray-100">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            <strong className="text-gray-900">CareerCraft</strong> is an AI-powered career assistance platform designed to help individuals build stronger resumes, discover the right job opportunities, and grow professionally with confidence.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Our goal is to simplify the job-seeking process by combining smart resume analysis, accurate job matching, and personalized career guidance in one unified platform.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            CareerCraft empowers students and professionals to understand their strengths, bridge skill gaps, and present themselves effectively in a competitive job market.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                        What Makes Us <span className="text-blue-600">Different</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Card 1: Our Mission */}
                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                    <Target className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        To help job-seekers unlock better opportunities through AI-driven insights and career tools.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-300 hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                                    <Brain className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We use modern AI and NLP techniques to analyze resumes, match skills, and generate impactful documents.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-300 hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                                    <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">User-First Design</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        CareerCraft is built with simplicity and clarity, ensuring an intuitive experience for every user.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-indigo-300 hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                                    <TrendingUp className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Career Growth</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        From resume optimization to skill improvement, we support continuous learning and growth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Preview Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-sky-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Product <span className="text-blue-600">Preview</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the power of AI-driven career tools designed to elevate your professional journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Resume Analysis Feature */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Analysis</h3>
                            <p className="text-gray-600 mb-4">
                                Get instant feedback on your resume with ATS compatibility checks, keyword optimization, and formatting suggestions.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> ATS Score Rating
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Keyword Analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Actionable Suggestions
                                </li>
                            </ul>
                        </div>

                        {/* Job Matching Feature */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Job Matching</h3>
                            <p className="text-gray-600 mb-4">
                                Discover opportunities that align with your skills, experience, and career goals using our intelligent matching algorithm.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Skill-based Matching
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Compatibility Scores
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Gap Analysis
                                </li>
                            </ul>
                        </div>

                        {/* Cover Letter Generator Feature */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cover Letter Generator</h3>
                            <p className="text-gray-600 mb-4">
                                Create personalized, professional cover letters tailored to specific job descriptions in seconds.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> AI-Powered Generation
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Customizable Templates
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Save & Manage
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Designed For Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Designed <span className="text-blue-600">For</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            CareerCraft serves diverse audiences at every stage of their career journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Students & Recent Graduates */}
                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Students & Recent Graduates</h3>
                            <p className="text-gray-600 mb-4">
                                Build your first professional resume, understand industry expectations, and prepare for your career launch with confidence.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Resume templates optimized for entry-level roles</li>
                                <li>• Career guidance and skill recommendations</li>
                                <li>• Interview preparation resources</li>
                            </ul>
                        </div>

                        {/* Working Professionals */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Working Professionals</h3>
                            <p className="text-gray-600 mb-4">
                                Advance your career by optimizing your resume, discovering better opportunities, and staying competitive in your field.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Mid-level to senior resume optimization</li>
                                <li>• Job matching based on experience</li>
                                <li>• Skill gap analysis and upskilling paths</li>
                            </ul>
                        </div>

                        {/* Career Changers */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Changers</h3>
                            <p className="text-gray-600 mb-4">
                                Transition into a new field by highlighting transferable skills, identifying relevant opportunities, and building a compelling narrative.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Transferable skills identification</li>
                                <li>• Industry transition guidance</li>
                                <li>• Re-branding and positioning support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-indigo-600">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
                        Your Career Journey with CareerCraft
                    </h2>
                    <p className="text-center text-blue-100 text-lg mb-12">
                        From resume building to landing your dream job
                    </p>

                    <div className="space-y-8">
                        {/* Timeline Item 1 */}
                        <div className="flex gap-6 items-start group">
                            <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">
                                1
                            </div>
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                <h4 className="text-xl font-bold text-white mb-2">Upload Your Resume</h4>
                                <p className="text-blue-100">
                                    Start by uploading your existing resume. Our AI analyzes it instantly.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group">
                            <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">
                                2
                            </div>
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                <h4 className="text-xl font-bold text-white mb-2">Get Personalized Insights</h4>
                                <p className="text-blue-100">
                                    Receive detailed feedback on strengths, weaknesses, and improvement areas.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group">
                            <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">
                                3
                            </div>
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                <h4 className="text-xl font-bold text-white mb-2">Match with Opportunities</h4>
                                <p className="text-blue-100">
                                    Discover job roles that align perfectly with your skills and experience.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group">
                            <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">
                                4
                            </div>
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                <h4 className="text-xl font-bold text-white mb-2">Grow Continuously</h4>
                                <p className="text-blue-100">
                                    Bridge skill gaps with targeted recommendations and resources.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Career?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of professionals who are building better careers with CareerCraft
                        </p>
                        <button className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                            Start Your Journey
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
