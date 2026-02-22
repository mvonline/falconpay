import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, QrCode, Shield, PieChart as PieIcon } from 'lucide-react';
import { TabNavigation } from './components/TabNavigation';
import { BalanceCard } from './components/BalanceCard';
import { TransactionItem } from './components/TransactionItem';
import { AdminDashboard } from './admin/AdminDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="bg-white border-b px-8 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="text-primary" />
            <span className="font-bold">FalconPay Admin</span>
          </div>
          <button onClick={() => setIsAdmin(false)} className="text-sm text-primary font-bold">Switch to App</button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold ring-4 ring-white shadow-lg">
            MV
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Good Morning</p>
            <h1 className="text-sm font-bold text-gray-900">Masoud Vafaei</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAdmin(true)} className="p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-100">
            <Shield size={20} className="text-primary" />
          </button>
          <button className="p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-100 relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <main className="px-6 space-y-8 flex-1">
        {/* Balance Section */}
        <BalanceCard amount={12450.500} />

        {/* Quick Actions */}
        <section className="grid grid-cols-4 gap-4">
          {[
            { icon: QrCode, label: 'Scan', color: 'bg-indigo-50 text-indigo-500' },
            { icon: Search, label: 'Explore', color: 'bg-blue-50 text-blue-500' },
            { icon: Bell, label: 'Bills', color: 'bg-orange-50 text-orange-500' },
            { icon: PieIcon, label: 'Grants', color: 'bg-pink-50 text-pink-500' },
          ].map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
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
        <section className="space-y-4 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">See All</button>
          </div>

          <div className="space-y-3">
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
            <TransactionItem
              title="Transfer from Ahmed"
              type="receive"
              amount={15.000}
              date="21 Feb, 09:10 AM"
            />
          </div>
        </section>
      </main>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
