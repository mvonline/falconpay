import { User, LogOut, ChevronRight, Bell, Lock, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: User, label: 'Personal Information', sub: 'Manage your profile data' },
        { icon: Lock, label: 'Security', sub: 'Password and 2FA settings' },
        { icon: CreditCard, label: 'Payment Methods', sub: 'Manage cards and accounts' },
        { icon: Bell, label: 'Notifications', sub: 'Preferences and alerts' },
        { icon: Shield, label: 'Privacy Policy', sub: 'Our commitment to your data' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-primary pt-12 pb-24 px-6 rounded-b-[3rem] text-white">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-bold">Profile</h1>
                    <button onClick={handleLogout} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-primary text-3xl font-bold shadow-2xl relative mb-4">
                        {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'N'}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-primary rounded-full" />
                    </div>
                    <h2 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-white/70 text-sm">{user?.email}</p>
                </div>
            </div>

            {/* Menu */}
            <div className="px-6 -mt-12 space-y-4">
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 space-y-2">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <item.icon size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-sm font-bold text-gray-900">{item.label}</h4>
                                <p className="text-xs text-gray-500">{item.sub}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-5 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-[2rem] transition-colors"
                >
                    <LogOut size={20} />
                    Log Out of Account
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
                    FalconPay v0.0.1 Beta
                </p>
            </div>
        </div>
    );
};
