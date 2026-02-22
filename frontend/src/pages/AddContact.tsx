import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import client from '../api/client';

export const AddContact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call for now since we don't have a specific contact service
            // In a real app this might go to UserService or a dedicated ContactService
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
            setTimeout(() => navigate('/contacts'), 1500);
        } catch (error) {
            console.error('Failed to add contact', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="p-6 flex items-center gap-4 border-b border-gray-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Add New Contact</h1>
            </header>

            <div className="p-8">
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                    >
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Contact Added!</h2>
                        <p className="text-gray-500">You can now send payments to {formData.name}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-100">
                                <UserPlus size={40} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="+968 9xxx xxxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email (Optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Saving...' : 'Add Contact'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full mt-2 py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
