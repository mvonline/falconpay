import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, QrCode, Shield, Plus, UserPlus } from 'lucide-react';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionItem } from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const balanceRes = await client.get('/wallets/balance');
                setBalance(balanceRes.data.balance);

                // Assuming /payments/history or similar exists
                // const historyRes = await client.get('/payments/history');
                // setTransactions(historyRes.data);
            } catch (error) {
                console.error('Error fetching home data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const quickActions = [
        { icon: QrCode, label: 'Scan', color: 'bg-indigo-50 text-indigo-500' },
        { icon: Search, label: 'Explore', color: 'bg-blue-50 text-blue-500' },
        { icon: UserPlus, label: 'Contacts', color: 'bg-orange-50 text-orange-500', onClick: () => navigate('/contacts') },
        { icon: Plus, label: 'Add', color: 'bg-pink-50 text-pink-500' },
    ];

    return (
        <div className="pb-10">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white sticky top-0 z-20 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold ring-4 ring-primary/10 shadow-lg cursor-pointer" onClick={() => navigate('/profile')}>
                        {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'N'}
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Good Morning</p>
                        <h1 className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/admin')} className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Shield size={20} className="text-primary" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
                        <Bell size={20} className="text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                </div>
            </header>

            <div className="px-6 pt-6 space-y-8">
                {/* Balance Section */}
                <BalanceCard amount={balance} />

                {/* Quick Actions */}
                <section className="grid grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.button
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={action.onClick}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={`p-4 rounded-3xl ${action.color} shadow-sm active:scale-95 transition-transform`}>
                                <action.icon size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{action.label}</span>
                        </motion.button>
                    ))}
                </section>

                {/* Transactions Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">See All</button>
                    </div>

                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((tx: any) => (
                                <TransactionItem key={tx.id} {...tx} />
                            ))
                        ) : (
                            <>
                                <TransactionItem
                                    title="Starbucks Coffee"
                                    type="food"
                                    amount={-2.450}
                                    date="Today, 08:32 AM"
                                />
                                <TransactionItem
                                    title="Salary Deposit"
                                    type="receive"
                                    amount={1200.000}
                                    date="Yesterday, 04:15 PM"
                                />
                                <TransactionItem
                                    title="Zara Shopping"
                                    type="shopping"
                                    amount={-45.900}
                                    date="22 Feb, 11:20 AM"
                                />
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
