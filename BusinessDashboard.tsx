
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, BarChart3 } from 'lucide-react';

interface BusinessDashboardProps {
  transactions: Transaction[];
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ transactions }) => {
  const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
  const net = income - expenses;
  const estimatedTax = income * 0.26;
  
  const hasData = transactions.length > 0;

  const barData = hasData 
    ? transactions.slice(-5).map(t => ({ name: t.description.slice(0,3), value: t.amount }))
    : [];

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
               <ArrowUpRight className="w-6 h-6" />
             </div>
             {hasData && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">+8.4%</span>}
           </div>
           <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">Entrate Totali</p>
           <h4 className="text-4xl font-bold font-geist tracking-tighter dark:text-white">€{income.toLocaleString()}</h4>
        </div>

        <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
               <ArrowDownRight className="w-6 h-6" />
             </div>
             {hasData && <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-full">-3.1%</span>}
           </div>
           <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">Costi Operativi</p>
           <h4 className="text-4xl font-bold font-geist tracking-tighter dark:text-white">€{expenses.toLocaleString()}</h4>
        </div>

        <div className="bg-slate-900 dark:bg-indigo-600 p-10 rounded-[40px] shadow-2xl shadow-slate-200 dark:shadow-none text-white transition-all hover:-translate-y-1">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-white/10 text-white rounded-2xl backdrop-blur-md">
               <Activity className="w-6 h-6" />
             </div>
           </div>
           <p className="text-slate-400 dark:text-indigo-100 font-bold text-xs uppercase tracking-[0.2em] mb-1 opacity-60">Utile Netto</p>
           <h4 className="text-4xl font-bold font-geist tracking-tighter">€{net.toLocaleString()}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 border border-slate-100 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-center mb-10">
             <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-3 tracking-tight">
               <Wallet className="w-5 h-5 text-indigo-500" /> 
               Accantonamento Tasse
             </h4>
             <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Est. 26% IRPEF</p>
           </div>
           
           <div className="space-y-6">
              <div className="h-6 w-full bg-slate-50 dark:bg-slate-900/50 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 p-1">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: hasData ? '65%' : '0%' }} 
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Maturato</p>
                  <p className="text-4xl font-bold font-geist tracking-tight dark:text-white">€{estimatedTax.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">IN REGOLA</p>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 border border-slate-100 dark:border-slate-700 shadow-sm min-h-[300px] flex flex-col">
           <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-8 flex items-center gap-3 tracking-tight">
             <BarChart3 className="w-5 h-5 text-indigo-500" />
             Flusso Cassa Recente
           </h4>
           <div className="flex-1 flex items-center justify-center">
             {hasData ? (
                <div className="h-full w-full min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 8, 8]} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             ) : (
                <div className="text-center py-10 opacity-30 dark:opacity-20 animate-pulse">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] dark:text-slate-400">Analisi non disponibile</p>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
