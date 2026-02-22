import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../types';

export const Contacts = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Ahmed Al Balushi', phone: '+968 9123 4567', color: 'bg-indigo-50 text-indigo-500' } as any,
        { id: '2', name: 'Fatima Al Lawati', phone: '+968 9988 7766', color: 'bg-pink-50 text-pink-500' } as any,
        { id: '3', name: 'Mazin Al Habsi', phone: '+968 9234 5678', color: 'bg-blue-50 text-blue-500' } as any,
        { id: '4', name: 'Salma Al Zadjali', phone: '+968 9567 8901', color: 'bg-orange-50 text-orange-500' } as any,
    ]);

    const filteredContacts = contacts.filter((c: Contact) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="pb-10 min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    <button
                        onClick={() => navigate('/contacts/add')}
                        className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search name or phone number..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 p-6 space-y-6">
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Network</h3>
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact: any, i: number) => (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 rounded-3xl border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-4 cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${contact.color}`}>
                                    {contact.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{contact.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{contact.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-300 hover:text-primary transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 px-10 space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                                <Search size={32} />
                            </div>
                            <h4 className="font-bold text-gray-900">No results found</h4>
                            <p className="text-sm text-gray-500 text-center">We couldn't find any contact matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
