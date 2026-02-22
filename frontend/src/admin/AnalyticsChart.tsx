import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: '01 Feb', volume: 4000 },
    { name: '05 Feb', volume: 3000 },
    { name: '10 Feb', volume: 5000 },
    { name: '15 Feb', volume: 4500 },
    { name: '20 Feb', volume: 6000 },
    { name: '22 Feb', volume: 5500 },
];

export const AnalyticsChart = () => {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Transaction Volume (24h)</h4>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F7FA" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#0066FF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
