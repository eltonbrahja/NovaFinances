
import React from 'react';
import { UserType } from '../types';
import { Briefcase, User, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onSelectType: (type: UserType) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onSelectType }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-in fade-in duration-1000 bg-soft-bg dark:bg-[#020617]">
      <div className="mb-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-5 mb-4 bg-white dark:bg-slate-900 rounded-[32px] shadow-premium dark:shadow-none border border-slate-100/50 dark:border-slate-800">
          <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-geist">
          Nova Finance
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Un'esperienza finanziaria raffinata, pensata per il tuo futuro.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => onSelectType(UserType.PRIVATE)}
          className="group relative flex flex-col p-10 bg-white/90 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[48px] text-left transition-all duration-500 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 active:scale-[0.97]"
        >
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-3xl w-fit mb-8 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Privato</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Gestisci le spese personali e il budget di casa con eleganza e semplicità.
          </p>
          <div className="mt-10 flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            ENTRA NEL TUO MONDO &nbsp; →
          </div>
        </button>

        <button
          onClick={() => onSelectType(UserType.BUSINESS)}
          className="group relative flex flex-col p-10 bg-white/90 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[48px] text-left transition-all duration-500 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 active:scale-[0.97]"
        >
          <div className="p-5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit mb-8 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Business</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Monitora flussi di cassa, tasse e analytics per far crescere la tua attività.
          </p>
          <div className="mt-10 flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            GESTISCI IL TUO BUSINESS &nbsp; →
          </div>
        </button>
      </div>
      
      <p className="mt-16 text-slate-400 dark:text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em]">
        Made by Elton Brahja • Privacy First
      </p>
    </div>
  );
};

export default SplashScreen;
