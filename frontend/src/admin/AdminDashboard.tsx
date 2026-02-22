import { useState } from 'react';
import {
    BarChart3,
    Users,
    Search,
    Filter,
    Download,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { AnalyticsChart } from './AnalyticsChart';

export const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');



    // Static stats for demonstration
    const stats = [
        { label: 'Total Volume', value: '45,230 OMR', trend: '+12%', icon: BarChart3, color: 'text-blue-500' },
        { label: 'Active Users', value: '1,284', trend: '+5%', icon: Users, color: 'text-purple-500' },
        { label: 'Success Rate', value: '98.2%', trend: '+0.4%', icon: CheckCircle2, color: 'text-green-500' },
    ];

    return (
        <div className="flex-1 bg-gray-50 min-h-screen p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
                    <p className="text-gray-500 text-sm">Monitor platform health and financial activity</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={18} />
                        Export data
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                        Create Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2">
                    <AnalyticsChart />
                </div>
                {/* Stats Grid */}
                <div className="flex flex-col gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-green-500 text-xs font-bold leading-none bg-green-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>


            {/* Advanced Table Panel */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Transaction ID or User ID..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="FAILED">Failed</option>
                            <option value="PENDING">Pending</option>
                        </select>
                        <button className="bg-gray-50 p-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Sender / Receiver</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Demo Row */}
                            {[
                                { id: 'TX-9482', from: 'User_82', to: 'Merc_10', amount: '24.500', status: 'COMPLETED', date: 'Feb 22, 12:04' },
                                { id: 'TX-9481', from: 'User_15', to: 'User_09', amount: '120.000', status: 'FAILED', date: 'Feb 22, 11:55' },
                                { id: 'TX-9480', from: 'User_44', to: 'User_12', amount: '5.000', status: 'PENDING', date: 'Feb 21, 23:10' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{row.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 text-sm">{row.from}</span>
                                            <span className="text-gray-300">→</span>
                                            <span className="font-medium text-gray-600 text-sm">{row.to}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{row.amount} OMR</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status === 'COMPLETED' ? 'bg-green-50 text-green-500' :
                                            row.status === 'FAILED' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                                            }`}>
                                            {row.status === 'COMPLETED' ? <CheckCircle2 size={12} /> :
                                                row.status === 'FAILED' ? <AlertCircle size={12} /> : <Clock size={12} />}
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/30 flex justify-between items-center text-sm text-gray-500">
                    <p>Showing 1 to 3 of 42 transactions</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
