
import React, { useState, useRef } from 'react';
import { UserType, FinanceState, Transaction, TransactionType } from '../types';
import PrivateDashboard from './PrivateDashboard';
import BusinessDashboard from './BusinessDashboard';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import { Plus, LogOut, Sun, Moon, Download, Terminal, Copy, CheckCircle2, X, FileSpreadsheet, Upload, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DashboardProps {
  state: FinanceState;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAddTransaction: (tx: Transaction) => void;
  onImportTransactions: (txs: Transaction[]) => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, isDarkMode, onToggleTheme, onAddTransaction, onImportTransactions, onReset }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showImportInfo, setShowImportInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToExcel = () => {
    const dataToExport = state.transactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString('it-IT'),
      Descrizione: t.description,
      Importo: t.amount,
      Valuta: 'EUR',
      Tipo: t.type === TransactionType.INCOME ? 'Entrata' : 'Uscita',
      Categoria: t.category,
      Deducibile: t.isDeductible ? 'Sì' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transazioni");
    XLSX.writeFile(workbook, `Nova_Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const importedTxs: Transaction[] = data.map((item, idx) => ({
          id: crypto.randomUUID() + idx,
          amount: parseFloat(item.Importo) || 0,
          description: item.Descrizione || 'Transazione Importata',
          category: item.Categoria || 'generica',
          date: item.Data ? new Date(item.Data.split('/').reverse().join('-')).toISOString() : new Date().toISOString(),
          type: item.Tipo === 'Entrata' ? TransactionType.INCOME : TransactionType.EXPENSE,
          isDeductible: item.Deducibile === 'Sì'
        }));

        if (importedTxs.length > 0) {
          onImportTransactions(importedTxs);
          alert(`${importedTxs.length} transazioni importate con successo!`);
        } else {
          alert("Nessun dato valido trovato nel file Excel.");
        }
      } catch (error) {
        console.error("Errore durante l'importazione:", error);
        alert("Errore durante l'importazione del file. Assicurati che il formato sia corretto.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-16">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${state.userType === UserType.BUSINESS ? 'bg-indigo-500' : 'bg-emerald-500'} animate-pulse`} />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
              Nova Finance System
            </h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-geist tracking-tighter">
            {state.userType === UserType.BUSINESS ? 'Business Suite' : 'Personal Wealth'}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-2 px-5 py-4 bg-white/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-[24px] border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all shadow-premium hover:shadow-premium-hover font-semibold text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline">Installa Locale</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm">
             <button onClick={exportToExcel} className="p-3 text-slate-500 hover:text-emerald-500 transition-all rounded-2xl hover:bg-white dark:hover:bg-slate-700" title="Esporta Excel">
               <FileSpreadsheet className="w-5 h-5" />
             </button>
             <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-indigo-500 transition-all rounded-2xl hover:bg-white dark:hover:bg-slate-700" title="Importa Excel">
               <Upload className="w-5 h-5" />
             </button>
             <button onClick={() => setShowImportInfo(true)} className="p-3 text-slate-400 hover:text-blue-500 transition-all rounded-2xl hover:bg-white dark:hover:bg-slate-700">
               <Info className="w-5 h-5" />
             </button>
             <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".xlsx, .xls, .csv" />
          </div>

          <button onClick={onToggleTheme} className="p-4 text-slate-500 bg-white/80 dark:bg-slate-800/50 hover:text-indigo-500 rounded-[24px] border border-slate-200 dark:border-slate-700 transition-all shadow-premium hover:shadow-premium-hover">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={onReset} 
            className="p-4 text-slate-500 bg-white/80 dark:bg-slate-800/50 hover:text-rose-500 rounded-[24px] border border-slate-200 dark:border-slate-700 transition-all shadow-premium hover:shadow-premium-hover"
            title="Torna alla Home"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowAddForm(true)}
            className="flex-1 sm:flex-none bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center gap-2 px-8 py-4 rounded-[24px] font-bold hover:shadow-deep hover:-translate-y-1 transition-all active:scale-95 shadow-premium"
          >
            <Plus className="w-5 h-5" />
            <span>Nuova</span>
          </button>
        </div>
      </header>

      <main className="space-y-16 min-h-[60vh]">
        {state.userType === UserType.PRIVATE ? (
          <PrivateDashboard transactions={state.transactions} />
        ) : (
          <BusinessDashboard transactions={state.transactions} />
        )}

        <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
          <TransactionHistory transactions={state.transactions} userType={state.userType} />
        </div>
      </main>

      <footer className="mt-32 text-center pb-12 border-t border-slate-200 dark:border-slate-800 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-700">
          Developed by Elton Brahja
        </p>
      </footer>

      {/* MODALE IMPORT INFO */}
      {showImportInfo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowImportInfo(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] p-10 md:p-14 shadow-deep animate-in zoom-in-95 ease-spring">
             <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight">Formato Excel</h3>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Guida all'importazione</p>
                </div>
                <button onClick={() => setShowImportInfo(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-all"><X /></button>
             </div>
             
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
               Il file deve contenere un foglio con le seguenti colonne con l'intestazione esatta (case-sensitive):
             </p>

             <div className="space-y-3 mb-10 font-mono text-[11px]">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Data</span>
                  <span className="text-slate-400 uppercase">Es: 15/05/2024</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Descrizione</span>
                  <span className="text-slate-400 uppercase">Testo libero</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Importo</span>
                  <span className="text-slate-400 uppercase">Valore numerico</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Tipo</span>
                  <span className="text-slate-400 uppercase">"Entrata" o "Uscita"</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Categoria</span>
                  <span className="text-slate-400 uppercase">es. svago, food, saas</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Deducibile</span>
                  <span className="text-slate-400 uppercase">"Sì" o "No"</span>
                </div>
             </div>

             <button onClick={() => setShowImportInfo(false)} className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-[24px] font-bold text-lg hover:shadow-xl transition-all active:scale-95">
               Tutto Chiaro
             </button>
          </div>
        </div>
      )}

      {/* MODALE INSTALLAZIONE LOCALE */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowInstallModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-deep overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500 ease-spring p-10 md:p-14">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Terminal className="w-3 h-3" />
                    Guida Developer
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">Installa Nova Locale</h3>
                </div>
                <button onClick={() => setShowInstallModal(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-200 transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-8 text-slate-600 dark:text-slate-400">
                <div className="space-y-6">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-sm">1</div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Requisiti di Sistema</p>
                      <p className="text-sm">Assicurati di avere installato <span className="text-indigo-500 font-mono">Node.js</span> e <span className="text-indigo-500 font-mono">Git</span> sul tuo computer.</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-sm">2</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white mb-3">Setup e Avvio</p>
                      <div className="bg-slate-950 rounded-[28px] p-8 font-mono text-[11px] text-indigo-300 shadow-inner relative group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="opacity-50"># Terminale / Command Prompt</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>git clone https://github.com/tony/nova.git</span>
                            <Copy className="w-3 h-3 cursor-pointer hover:text-white" />
                          </div>
                          <div>cd nova && npm install</div>
                          <div className="text-emerald-400 mt-2 font-bold">npm run dev</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-900/30 flex gap-4 items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">I dati rimangono salvati nel browser locale (localStorage) per la massima privacy.</p>
                </div>
              </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-card-bg dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-deep overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500 ease-spring p-10 md:p-14">
              <TransactionForm userType={state.userType} onClose={() => setShowAddForm(false)} onAdd={onAddTransaction} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
