import { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { motion } from 'framer-motion';

export const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await client.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-white p-8 flex flex-col justify-center max-w-[480px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Join FalconPay</h1>
                    <p className="text-gray-500 mt-2 text-center">Secure your future with the next generation wallet</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="+968 9xxx xxxx"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl mt-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4 group"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
