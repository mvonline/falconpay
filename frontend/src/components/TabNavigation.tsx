import { motion } from 'framer-motion';
import { Home, Wallet, PieChart, User } from 'lucide-react';

const tabs = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Wallet, label: 'Wallet', id: 'wallet' },
    { icon: PieChart, label: 'Stats', id: 'stats' },
    { icon: User, label: 'Profile', id: 'profile' },
];

export const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 flex justify-around items-center px-4 py-3 safe-area-bottom z-50">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center gap-1 group"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        <tab.icon size={24} />
                    </div>

                    <span className={`text-[10px] font-medium ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
                        {tab.label}
                    </span>
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="tab-pill"
                            className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-primary"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </nav>
    );
};
