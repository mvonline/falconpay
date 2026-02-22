import { motion } from 'framer-motion';
import { Plus, Send, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const BalanceCard = ({ amount }: { amount: number }) => {
    const [showBalance, setShowBalance] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/20"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold">
                            {showBalance ? `${amount.toLocaleString()} OMR` : '•••••••'}
                        </h2>
                        <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <img src="/logo-icon.svg" className="w-8 h-8 opacity-50" alt="" />
                </div>
            </div>

            <div className="flex gap-4">
                <button className="flex-1 bg-white text-primary font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition-transform active:scale-95">
                    <Plus size={20} />
                    Add
                </button>
                <button className="flex-1 bg-white/20 backdrop-blur-md text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-transform active:scale-95">
                    <Send size={20} />
                    Send
                </button>
            </div>

            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
    );
};
