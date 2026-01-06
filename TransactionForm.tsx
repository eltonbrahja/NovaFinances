
import React, { useState, useMemo, useEffect } from 'react';
import { UserType, Transaction, TransactionType } from '../types';
import { 
  PRIVATE_EXPENSE_CATEGORIES, 
  PRIVATE_INCOME_CATEGORIES, 
  BUSINESS_EXPENSE_CATEGORIES, 
  BUSINESS_INCOME_CATEGORIES 
} from '../constants';
import { X, Check, Landmark, ReceiptText, ChevronRight, ArrowLeft } from 'lucide-react';

interface TransactionFormProps {
  userType: UserType;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ userType, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [isDeductible, setIsDeductible] = useState(false);
  
  const currentCategories = useMemo(() => {
    if (userType === UserType.PRIVATE) {
      return type === TransactionType.EXPENSE ? PRIVATE_EXPENSE_CATEGORIES : PRIVATE_INCOME_CATEGORIES;
    } else {
      return type === TransactionType.EXPENSE ? BUSINESS_EXPENSE_CATEGORIES : BUSINESS_INCOME_CATEGORIES;
    }
  }, [userType, type]);

  const [category, setCategory] = useState(currentCategories[0].id);

  useEffect(() => {
    setCategory(currentCategories[0].id);
  }, [currentCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      description: description.trim() || (type === TransactionType.INCOME ? 'Entrata' : 'Uscita'),
      category,
      date: new Date().toISOString(),
      type,
      isDeductible: userType === UserType.BUSINESS && type === TransactionType.EXPENSE ? isDeductible : undefined
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
           {[1, 2].map(s => (
             <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
           ))}
        </div>
        <button type="button" onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-[18px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"><X size={18} /></button>
      </div>

      {step === 1 ? (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tighter">Cassa & Tipologia</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 01 — Valore Movimento</p>
            </div>
            
            <div className="relative group bg-slate-100/50 dark:bg-slate-900/50 rounded-[40px] p-10 md:p-14 border-2 border-transparent focus-within:border-indigo-500/40 transition-all shadow-inner">
              <span className="absolute left-10 md:left-14 top-1/2 -translate-y-1/2 text-6xl font-light text-slate-300 dark:text-slate-800 pointer-events-none">€</span>
              <input 
                autoFocus
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-14 md:pl-20 text-7xl md:text-8xl font-geist font-bold tracking-tighter bg-transparent border-none focus:ring-0 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800"
              />
            </div>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[32px] gap-2 shadow-inner border border-slate-200/20 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[26px] font-bold transition-all duration-500 ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-800 shadow-xl text-rose-500 scale-[1.02]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-500'}`}
            >
              <ReceiptText size={20} /> <span className="tracking-tight">Uscita</span>
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[26px] font-bold transition-all duration-500 ${type === TransactionType.INCOME ? 'bg-white dark:bg-slate-800 shadow-xl text-emerald-500 scale-[1.02]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-500'}`}
            >
              <Landmark size={20} /> <span className="tracking-tight">Entrata</span>
            </button>
          </div>

          <button 
            type="button"
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => setStep(2)}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-7 rounded-[32px] font-bold text-xl flex items-center justify-center gap-4 disabled:opacity-30 hover:shadow-deep transition-all active:scale-95 group"
          >
            Configura Dettagli <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tighter">Analisi Dettagli</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 02 — Categorizzazione</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Cosa hai acquistato / incassato?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-[28px] p-7 font-semibold text-xl dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scegli Categoria</h4>
              <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {type === TransactionType.INCOME ? 'Entrate Disponibili' : 'Voci di Spesa'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all duration-500 text-left ${category === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.03]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <span className="text-3xl bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-[13px] font-bold tracking-tight leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {userType === UserType.BUSINESS && type === TransactionType.EXPENSE && (
            <div className="p-8 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-[40px] border border-indigo-100/50 dark:border-indigo-900/20 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Deducibile Fiscalmente</p>
                <p className="text-xs text-slate-400">Ottimizzazione IRPEF/IRES</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeductible(!isDeductible)}
                className={`w-14 h-8 rounded-full relative transition-all duration-500 ${isDeductible ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ${isDeductible ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="flex-1 py-7 bg-slate-100 dark:bg-slate-800 rounded-[32px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Indietro
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-slate-900 dark:bg-indigo-600 text-white py-7 rounded-[32px] font-bold text-xl flex items-center justify-center gap-4 shadow-deep hover:shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Check size={22} /> Conferma Movimento
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TransactionForm;
