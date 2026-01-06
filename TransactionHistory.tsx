
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, UserType } from '../types';
import { 
  PRIVATE_EXPENSE_CATEGORIES, 
  PRIVATE_INCOME_CATEGORIES, 
  BUSINESS_EXPENSE_CATEGORIES, 
  BUSINESS_INCOME_CATEGORIES 
} from '../constants';
import { ArrowUpDown, Filter, Search, Calendar, Tag, DollarSign, ChevronRight } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  userType: UserType;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, userType }) => {
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allCategories = useMemo(() => {
    return [
      ...PRIVATE_EXPENSE_CATEGORIES,
      ...PRIVATE_INCOME_CATEGORIES,
      ...BUSINESS_EXPENSE_CATEGORIES,
      ...BUSINESS_INCOME_CATEGORIES
    ];
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesType = filterType === 'all' || tx.type === filterType;
        const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortField === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortField === 'category') {
          comparison = a.category.localeCompare(b.category);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, sortField, sortOrder, filterType, filterCategory, searchTerm]);

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const categoriesToFilter = useMemo(() => {
    if (userType === UserType.PRIVATE) {
      return [...PRIVATE_EXPENSE_CATEGORIES, ...PRIVATE_INCOME_CATEGORIES];
    }
    return [...BUSINESS_EXPENSE_CATEGORIES, ...BUSINESS_INCOME_CATEGORIES];
  }, [userType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-bold tracking-tighter">Cronologia Movimenti</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500">Gestisci e filtra tutti i tuoi flussi finanziari</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cerca descrizione..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-full md:w-64 transition-all"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Tutti i tipi</option>
            <option value={TransactionType.INCOME}>Solo Entrate</option>
            <option value={TransactionType.EXPENSE}>Solo Uscite</option>
          </select>

          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Tutte le categorie</option>
            {categoriesToFilter.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 rounded-[40px] overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors group" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Data {sortField === 'date' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th className="px-8 py-6">Descrizione</th>
                <th className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors group" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Categoria {sortField === 'category' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors group text-right" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="w-3 h-3" />
                    Importo {sortField === 'amount' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <p className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight">
                        {new Date(tx.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">{tx.description}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tx.type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                        <span className="text-xs">{allCategories.find(c => c.id === tx.category)?.icon || '💸'}</span>
                        {allCategories.find(c => c.id === tx.category)?.name || tx.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className={`text-lg font-black tracking-tighter ${tx.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        {tx.type === TransactionType.INCOME ? '+' : '-'}€{tx.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="space-y-4 opacity-30">
                      <Filter className="w-12 h-12 mx-auto" />
                      <p className="font-bold text-xs uppercase tracking-[0.3em]">Nessun movimento trovato</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
