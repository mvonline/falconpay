import { useState } from 'react';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white p-8 flex flex-col justify-center max-w-[480px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
                        <Shield size={32} />
                    </div>

                    {!submitted ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                            <p className="text-gray-500 mt-2">Enter your email and we'll send you instructions to reset your password.</p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-green-50 rounded-full text-green-500 mb-4">
                                <CheckCircle2 size={48} />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Check your Email</h1>
                            <p className="text-gray-500 mt-2">We've sent a password reset link to <span className="font-bold text-gray-900">{email}</span></p>
                        </>
                    )}
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors pt-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </form>
                ) : (
                    <div className="space-y-6 pt-4">
                        <button
                            onClick={() => setSubmitted(false)}
                            className="w-full bg-gray-50 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all text-sm"
                        >
                            Try another email
                        </button>
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
