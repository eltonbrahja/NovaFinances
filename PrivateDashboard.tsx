
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PRIVATE_EXPENSE_CATEGORIES, PRIVATE_INCOME_CATEGORIES } from '../constants';
import { TrendingUp, CreditCard, Inbox } from 'lucide-react';

interface PrivateDashboardProps {
  transactions: Transaction[];
}

const PrivateDashboard: React.FC<PrivateDashboardProps> = ({ transactions }) => {
  const balance = transactions.reduce((acc, tx) => 
    tx.type === TransactionType.INCOME ? acc + tx.amount : acc - tx.amount, 0
  );

  const recentTransactions = transactions.slice(0, 5);
  const hasData = transactions.length > 0;

  const chartData = hasData 
    ? transactions.slice(-7).reverse().map((t, i) => ({ name: `T-${i}`, amount: t.amount }))
    : [];

  const getCategoryIcon = (tx: Transaction) => {
    const list = tx.type === TransactionType.INCOME ? PRIVATE_INCOME_CATEGORIES : PRIVATE_EXPENSE_CATEGORIES;
    return list.find(c => c.id === tx.category)?.icon || (tx.type === TransactionType.INCOME ? '💰' : '💳');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-slate-800 rounded-[40px] p-10 md:p-12 border border-slate-200/60 dark:border-slate-700 shadow-premium relative overflow-hidden group">
        <div className="relative z-10">
           <p className="text-slate-400 dark:text-slate-500 font-bold mb-2 tracking-wide uppercase text-[10px]">Patrimonio Attuale</p>
           <h3 className="text-6xl md:text-7xl font-bold font-geist tracking-tighter text-slate-900 dark:text-white">
             €{balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
           </h3>
           <div className="mt-8 flex gap-4">
             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 px-4 py-2 rounded-2xl text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                {hasData ? 'Salute finanziaria: Ottima' : 'In attesa di transazioni'}
             </div>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-12 text-slate-100/50 dark:text-slate-700/20 transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
           <CreditCard className="w-48 h-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800 rounded-[40px] p-10 border border-slate-200/60 dark:border-slate-700 shadow-premium flex flex-col min-h-[420px]">
           <div className="flex justify-between items-center mb-10">
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Analisi Asset</h4>
                <p className="text-slate-500 dark:text-slate-500 text-sm">Movimenti dell'ultimo periodo</p>
             </div>
           </div>
           
           <div className="flex-1 flex items-center justify-center">
             {hasData ? (
               <div className="h-full w-full min-h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                     <defs>
                       <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10b981" 
                        strokeWidth={5}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                        animationDuration={2000}
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="text-center space-y-6">
                 <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto border-4 border-white dark:border-slate-800 shadow-inner">
                    <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Nessun movimento</p>
                    <p className="text-slate-500 dark:text-slate-600 text-sm max-w-[240px] mx-auto">Comincia a tracciare le tue finanze per visualizzare i grafici.</p>
                 </div>
               </div>
             )}
           </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800 rounded-[40px] p-10 border border-slate-200/60 dark:border-slate-700 shadow-premium">
          <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-8 tracking-tight">Timeline</h4>
          <div className="space-y-8">
            {!hasData ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                <div className="w-12 h-[2px] bg-slate-200 dark:bg-slate-700" />
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Pausa</p>
                <div className="w-12 h-[2px] bg-slate-200 dark:bg-slate-700" />
              </div>
            ) : (
              recentTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between group cursor-default hover:bg-white dark:hover:bg-slate-900/60 p-4 -m-4 rounded-[24px] transition-all duration-300 hover:shadow-premium hover:scale-[1.03] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:rotate-6">
                      {getCategoryIcon(tx)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight leading-none mb-2">{tx.description}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        {new Date(tx.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg tracking-tighter ${tx.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                      {tx.type === TransactionType.INCOME ? '+' : '-'}€{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 tracking-widest">{tx.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateDashboard;
