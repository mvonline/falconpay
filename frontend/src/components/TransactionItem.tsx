import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Coffee } from 'lucide-react';

const icons = {
    payment: ArrowUpRight,
    receive: ArrowDownLeft,
    shopping: ShoppingBag,
    food: Coffee,
};

interface TransactionItemProps {
    title: string;
    type: keyof typeof icons;
    amount: number;
    date: string;
}

export const TransactionItem = ({ title, type, amount, date }: TransactionItemProps) => {
    const Icon = icons[type];
    const isNegative = amount < 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
        >
            <div className={`p-3 rounded-xl ${isNegative ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                }`}>
                <Icon size={24} />
            </div>

            <div className="flex-1">
                <h4 className="font-bold text-gray-900">{title}</h4>
                <p className="text-xs text-gray-500 font-medium">{date}</p>
            </div>

            <div className="text-right">
                <p className={`font-bold ${isNegative ? 'text-gray-900' : 'text-green-500'
                    }`}>
                    {isNegative ? '' : '+'}{amount.toLocaleString()} OMR
                </p>
            </div>
        </motion.div>
    );
};
