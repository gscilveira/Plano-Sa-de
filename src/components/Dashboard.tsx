import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { HealthPlan } from "../types";
import { 
  Flame, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  Calendar,
  Plus,
  Minus,
  CheckCircle2,
  Trophy,
  Activity,
  Zap,
  Target,
  User,
  Sun,
  Moon,
  Info,
  LogOut
} from "lucide-react";

interface DashboardProps {
  plan: HealthPlan;
  userName: string;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
  onReset: () => void;
  onLogout: () => void;
  history: HealthPlan[];
}

type Tab = 'resumo' | 'dieta' | 'treino' | 'agua' | 'perfil';

export default function Dashboard({ 
  plan, 
  userName,
  isLightMode, 
  setIsLightMode,
  onReset,
  onLogout,
  history 
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('resumo');
  const [waterDrunk, setWaterDrunk] = useState(0);
  const [checkedDays, setCheckedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  
  useEffect(() => {
    const savedWater = localStorage.getItem('vita_water');
    const savedDays = localStorage.getItem('vita_days');
    if (savedWater) setWaterDrunk(parseInt(savedWater));
    if (savedDays) setCheckedDays(JSON.parse(savedDays));
  }, []);

  const addWater = (amount: number) => {
    const newVal = Math.max(0, waterDrunk + amount);
    setWaterDrunk(newVal);
    localStorage.setItem('vita_water', newVal.toString());
  };

  const toggleDay = (dayIndex: number) => {
    const newDays = checkedDays.includes(dayIndex) 
      ? checkedDays.filter(d => d !== dayIndex)
      : [...checkedDays, dayIndex];
    setCheckedDays(newDays);
    localStorage.setItem('vita_days', JSON.stringify(newDays));
  };

  const tabs = [
    { id: 'resumo', label: 'RESUMO', icon: Activity },
    { id: 'dieta', label: 'DIETA', icon: Utensils },
    { id: 'treino', label: 'TREINO', icon: Calendar },
    { id: 'agua', label: 'ÁGUA', icon: Droplets },
    { id: 'perfil', label: 'PERFIL', icon: User },
  ];

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const trainingDaysGoal = plan.weeklyWorkout.filter(d => d.exercises.length > 0).length;
  const completedTrainingDays = checkedDays.length;
  const trainingProgress = (completedTrainingDays / trainingDaysGoal) * 100;

  return (
    <div className={`space-y-8 ${isLightMode ? 'text-black' : 'text-white'}`}>
      <AnimatePresence mode="wait">
        {/* RESUMO */}
        {activeTab === 'resumo' ? (
          <motion.div
            key="resumo"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <h2 className={`text-3xl md:text-7xl font-bold tracking-tighter uppercase italic leading-none ${isLightMode ? 'text-black' : 'text-white'}`}>
                {plan.biotype}
              </h2>
              <p className="text-wellness-green text-xs tracking-[0.4em] font-black uppercase">Bio-Algoritmo Detectado</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
               <div className="glass-card p-4 md:p-8 rounded-[20px] md:rounded-[32px] border-wellness-green/10 flex flex-col justify-center">
                  <div className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>IMC</div>
                  <div className="text-3xl md:text-4xl font-mono text-wellness-green">{Math.floor(plan.imc)}</div>
               </div>
               <div className="glass-card p-4 md:p-8 rounded-[20px] md:rounded-[32px] border-wellness-green/10 flex flex-col justify-center">
                  <div className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Meta Kcal</div>
                  <div className="text-3xl md:text-4xl font-mono text-wellness-green">{Math.floor(plan.dailyCalories)}</div>
               </div>
               <div className={`glass-card p-4 md:p-8 rounded-[20px] md:rounded-[32px] flex flex-col justify-center ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                  <div className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Gasto (TDEE)</div>
                  <div className="text-3xl md:text-4xl font-mono">{Math.floor(plan.tdee)}</div>
               </div>
               <div className={`glass-card p-4 md:p-8 rounded-[20px] md:rounded-[32px] flex flex-col justify-center ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                  <div className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Base (TMB)</div>
                  <div className="text-3xl md:text-4xl font-mono">{Math.floor(plan.tmb)}</div>
               </div>
            </div>

            <div className="glass-card p-5 md:p-10 rounded-[24px] md:rounded-[40px] border-wellness-green/20 relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-8">
                  <div className="space-y-2 text-center md:text-left">
                     <div className="text-[10px] text-wellness-green font-black uppercase tracking-[0.3em]">Meta de Consistência</div>
                     <h3 className="text-2xl md:text-4xl font-bold italic tracking-tighter uppercase">Protocolo de Treino</h3>
                     <p className={`text-sm font-medium ${isLightMode ? 'text-black/60' : 'text-white/40'}`}>Sua meta é de {trainingDaysGoal} sessões semanais para otimização máxima.</p>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-center">
                        <div className="text-5xl font-mono font-bold text-wellness-green">{completedTrainingDays}<small className={`text-xl ml-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>/{trainingDaysGoal}</small></div>
                        <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Sessões Concluídas</div>
                     </div>
                     <div className="w-20 h-20 relative">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                           <circle cx="18" cy="18" r="16" fill="none" stroke={isLightMode ? '#00000005' : '#ffffff05'} strokeWidth="3" />
                           <motion.circle 
                              cx="18" cy="18" r="16" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="100 100"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{ strokeDashoffset: 100 - Math.min(100, trainingProgress) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">{Math.round(trainingProgress)}%</div>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-wellness-green/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
               {plan.macros.map((m, i) => (
                 <div key={i} className={`glass-card p-4 md:p-8 rounded-[20px] md:rounded-[32px] ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <span className={`text-[10px] uppercase font-black tracking-widest ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>{m.name}</span>
                       <Zap className="w-3 h-3 text-wellness-green/30" />
                    </div>
                    <div className="text-2xl md:text-4xl font-mono">{Math.floor(m.value)}<small className={`text-xs ml-1 md:ml-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>{m.unit}</small></div>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : activeTab === 'dieta' ? (
          <motion.div
            key="dieta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 md:gap-4 px-2 md:px-4">
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-wellness-green/10 flex items-center justify-center shrink-0">
                  <Utensils className="text-wellness-green w-5 h-5 md:w-6 md:h-6" />
               </div>
               <h2 className="text-2xl md:text-4xl font-bold tracking-tighter uppercase italic">Protocolo Alimentar</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {plan.meals.map((meal, i) => (
                 <div key={i} className={`glass-card p-5 md:p-10 rounded-[24px] md:rounded-[40px] flex flex-col md:flex-row md:items-center gap-4 md:gap-10 hover:border-wellness-green/20 transition-all group ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                    <div className={`flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start min-w-0 md:min-w-[120px] pb-3 md:pb-0 border-b md:border-b-0 md:border-r ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                       <div>
                         <span className="text-xs font-mono text-wellness-green mb-1 block">{meal.time}</span>
                         <span className={`text-lg md:text-2xl font-bold tracking-tighter uppercase group-hover:text-wellness-green transition-colors ${isLightMode ? 'text-black' : 'text-white'}`}>{meal.name}</span>
                       </div>
                       <div className="text-right md:hidden">
                         <span className={`text-2xl font-mono font-bold block ${isLightMode ? 'text-black' : 'text-white'}`}>{meal.calories}</span>
                         <span className={`text-[10px] uppercase font-black tracking-widest ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>KCAL</span>
                       </div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className={`text-sm md:text-lg leading-relaxed font-medium ${isLightMode ? 'text-black/60' : 'text-white/50'}`}>
                          {meal.foods.join(" / ")}
                       </p>
                    </div>
                    <div className="hidden md:block text-right shrink-0">
                       <span className={`text-3xl font-mono font-bold block ${isLightMode ? 'text-black' : 'text-white'}`}>{meal.calories}</span>
                       <span className={`text-[10px] uppercase font-black tracking-widest ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>KCALS EST.</span>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : activeTab === 'treino' ? (
          <motion.div
            key="treino"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
               <div>
                  <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter italic uppercase underline decoration-wellness-green decoration-4 ${isLightMode ? 'text-black' : 'text-white'}`}>Performance Semanal</h2>
                  <p className={`${isLightMode ? 'text-black/30' : 'text-white/20'} text-[10px] tracking-[0.5em] font-black uppercase mt-4`}>META: {trainingDaysGoal} SESSÕES ATIVAS / {(trainingProgress).toFixed(0)}% DE ADERÊNCIA</p>
               </div>
               <div className="glass-card px-8 py-4 rounded-full flex items-center gap-4">
                  <Trophy className="text-wellness-green w-5 h-5" />
                  <span className={`text-lg font-mono font-bold tracking-widest ${isLightMode ? 'text-black' : 'text-white'}`}>{completedTrainingDays}/{trainingDaysGoal} <small className={`${isLightMode ? 'text-black/20' : 'text-white/20'} text-xs text-[8px]`}>SESSÕES</small></span>
               </div>
            </div>

            {/* Weekly Selector */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
               {weekDays.map((day, i) => (
                 <button
                   key={i}
                    onClick={() => setSelectedDay(i)}
                    className={`flex flex-col items-center gap-1 md:gap-3 p-2 md:p-4 rounded-[14px] md:rounded-[24px] border transition-all duration-300 ${
                      selectedDay === i
                      ? 'bg-wellness-green border-wellness-green text-black scale-105 shadow-xl'
                      : `glass-card text-white/30 ${isLightMode ? 'border-black/5 shadow-none hover:bg-black/5 transition-colors' : 'border-white/5'}`
                    }`}
                  >
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest ${selectedDay === i ? 'text-black' : isLightMode ? 'text-black/30' : 'text-white/30'}`}>{day}</span>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border ${
                      selectedDay === i ? 'bg-black border-black text-wellness-green' : isLightMode ? 'border-black/10 bg-black/5' : 'border-white/5 bg-white/5'
                    }`}>
                       {checkedDays.includes(i) ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLightMode ? 'bg-black/10' : 'bg-white/10'}`} />}
                    </div>
                  </button>
               ))}
            </div>

            {/* Workout Details */}
            <div className={`glass-card p-4 md:p-10 rounded-[24px] md:rounded-[48px] ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-12">
                   <div>
                      <h3 className={`text-3xl font-bold tracking-tight italic uppercase ${isLightMode ? 'text-black' : 'text-white'}`}>{plan.weeklyWorkout[selectedDay]?.day || weekDays[selectedDay]}</h3>
                      <p className="text-wellness-green font-black uppercase text-[10px] tracking-widest mt-1">Foco: {plan.weeklyWorkout[selectedDay]?.focus || 'Descanso'}</p>
                   </div>
                   <button 
                     onClick={() => toggleDay(selectedDay)}
                     className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest border transition-all ${
                       checkedDays.includes(selectedDay)
                       ? 'bg-wellness-green/20 border-wellness-green text-wellness-green'
                       : 'bg-wellness-green text-black border-wellness-green hover:scale-105 active:scale-95'
                     }`}
                   >
                     {checkedDays.includes(selectedDay) ? 'TREINO CONCLUÍDO' : 'MARCAR COMO FEITO'}
                   </button>
                </div>

                <div className="space-y-4">
                   {plan.weeklyWorkout[selectedDay]?.exercises.map((ex, i) => (
                     <div key={i} className={`flex items-center justify-between p-3 md:p-6 rounded-[16px] md:rounded-[24px] border hover:border-wellness-green/30 group transition-all ${isLightMode ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">
                           <span className={`text-base md:text-2xl font-mono shrink-0 group-hover:text-wellness-green/40 transition-colors ${isLightMode ? 'text-black/10' : 'text-white/10'}`}>{(i+1).toString().padStart(2, '0')}</span>
                           <h4 className={`font-bold text-sm md:text-lg truncate ${isLightMode ? 'text-black' : 'text-white'}`}>{ex.name}</h4>
                        </div>
                        <div className="flex gap-2 md:gap-6 shrink-0 ml-2">
                           <div className="text-right min-w-[40px] md:min-w-[60px]">
                              <span className={`text-[8px] font-black uppercase block mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>SÉR.</span>
                              <span className="text-base md:text-xl font-mono text-wellness-green">{ex.sets}</span>
                           </div>
                           <div className="text-right min-w-[40px] md:min-w-[60px]">
                              <span className={`text-[8px] font-black uppercase block mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>REPS</span>
                              <span className={`text-base md:text-xl font-mono ${isLightMode ? 'text-black' : 'text-white'}`}>{ex.reps}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                   {(!plan.weeklyWorkout[selectedDay] || plan.weeklyWorkout[selectedDay].exercises.length === 0) && (
                     <div className="py-20 text-center">
                        <Zap className={`mx-auto w-12 h-12 mb-4 ${isLightMode ? 'text-black/5' : 'text-white/5'}`} />
                        <p className={`text-sm font-medium italic uppercase tracking-widest ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Recuperação Ativa Necessária</p>
                     </div>
                   )}
                </div>
            </div>
          </motion.div>
        ) : activeTab === 'agua' ? (
          <motion.div
            key="agua"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 md:py-10 space-y-8 md:space-y-12"
          >
             <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
                <svg className={`absolute inset-0 w-full h-full rounded-full border-8 overflow-hidden ${isLightMode ? 'border-black/5 bg-black/5' : 'border-white/5 bg-white/5'}`} viewBox="0 0 100 100">
                   <motion.rect
                     width="100"
                     height="100"
                     fill="#059669"
                     initial={{ y: 100 }}
                     animate={{ y: 100 - (Math.min(plan.waterTarget, waterDrunk) / plan.waterTarget) * 100 }}
                     transition={{ duration: 1, ease: "easeOut" }}
                   />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <Droplets className={`w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 ${isLightMode ? 'text-wellness-green' : 'text-white'}`} />
                   <div className={`text-5xl md:text-7xl font-mono font-bold ${isLightMode ? 'text-black' : 'text-white'}`}>{waterDrunk}</div>
                   <div className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black ${isLightMode ? 'text-black/40' : 'text-white/60'}`}>ML / {plan.waterTarget}ML</div>
                </div>
             </div>

             <div className="flex flex-col items-center gap-4 md:gap-6">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-xs md:max-w-sm">
                   {Array.from({ length: Math.ceil(plan.waterTarget / 250) }).map((_, idx) => {
                      const isFilled = waterDrunk >= (idx + 1) * 250;
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`w-10 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                            isFilled 
                            ? 'bg-wellness-green border-wellness-green text-black' 
                            : isLightMode ? 'bg-black/5 border-black/5 text-black/10' : 'bg-white/5 border-white/5 text-white/10'
                          }`}
                        >
                           <Droplets className={`w-5 h-5 ${isFilled ? 'fill-current' : ''}`} />
                        </motion.div>
                      );
                   })}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isLightMode ? 'text-black/30' : 'text-white/20'}`}>
                   Faltam {Math.max(0, plan.waterTarget - waterDrunk)}ml para bater a meta
                </p>
             </div>

             <div className="flex gap-3 md:gap-4 items-center">
                <button
                  onClick={() => addWater(-500)}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] glass-card flex flex-col items-center justify-center hover:bg-white/10 transition-all border-white/5"
                >
                  <Minus className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${isLightMode ? 'text-black/30' : 'text-white/50'}`} />
                  <span className={`text-[9px] md:text-[10px] font-black uppercase ${isLightMode ? 'text-black/20' : 'text-white/30'}`}>-500ml</span>
                </button>
                <button
                   onClick={() => addWater(250)}
                   className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[48px] bg-wellness-green text-black flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(198,255,0,0.4)]"
                >
                   <Plus className="w-8 h-8 md:w-10 md:h-10 mb-1" />
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">BEBER</span>
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] glass-card flex flex-col items-center justify-center hover:bg-white/10 transition-all border-white/5"
                >
                   <Plus className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${isLightMode ? 'text-black/30' : 'text-white/50'}`} />
                   <span className={`text-[9px] md:text-[10px] font-black uppercase ${isLightMode ? 'text-black/20' : 'text-white/30'}`}>+500ml</span>
                </button>
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="perfil"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 md:gap-6 px-2 md:px-4">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-wellness-green flex items-center justify-center text-black shrink-0">
                   <User className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                <div className="min-w-0">
                   <h2 className={`text-2xl md:text-4xl font-bold tracking-tighter uppercase italic leading-none truncate ${isLightMode ? 'text-black' : 'text-white'}`}>{userName}</h2>
                   <p className={`text-xs font-black uppercase tracking-widest mt-2 ${isLightMode ? 'text-black/20' : 'text-white/30'}`}>Protocolo de Performance: ID #{(Math.random() * 1000000).toFixed(0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`glass-card p-5 md:p-10 rounded-[28px] md:rounded-[48px] space-y-6 md:space-y-8 ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                  <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Configurações de Bio-Scan</h3>
                  
                  <div className={`flex items-center justify-between p-6 rounded-[24px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLightMode ? 'bg-wellness-green text-black' : 'bg-white/10 text-white'}`}>
                           {isLightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </div>
                        <div>
                           <div className={`text-sm font-bold uppercase tracking-widest ${isLightMode ? 'text-black' : 'text-white'}`}>{isLightMode ? 'Modo Claro' : 'Modo Escuro'}</div>
                           <div className={`text-[10px] font-bold uppercase mt-0.5 ${isLightMode ? 'text-black/20' : 'text-white/30'}`}>ESTÉTICA DO TERMINAL</div>
                        </div>
                     </div>
                     <button 
                       onClick={() => setIsLightMode(!isLightMode)}
                       className={`w-14 h-8 rounded-full p-1 transition-all ${isLightMode ? 'bg-wellness-green' : 'bg-white/10'}`}
                     >
                        <div className={`w-6 h-6 rounded-full shadow-sm transition-all transform ${isLightMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/50'}`} />
                     </button>
                  </div>

                  <div className={`pt-6 border-t space-y-4 ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                     <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                        <span className={`underline decoration-wellness-green decoration-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Status do Protocolo</span>
                        <span className="text-wellness-green">ATIVO</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                        <span className={`underline decoration-wellness-green decoration-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Versão do Sistema</span>
                        <span className={isLightMode ? 'text-black' : 'text-white'}>3.0.4-LATEST</span>
                     </div>
                  </div>
               </div>

               <div className={`glass-card p-5 md:p-10 rounded-[28px] md:rounded-[48px] flex flex-col justify-between ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
                  <div className="space-y-6">
                     <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Métricas de Bio-Análise</h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className={`p-6 rounded-[24px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>IMC</div>
                           <div className="text-2xl font-mono text-wellness-green">{Math.floor(plan.imc)}</div>
                        </div>
                        <div className={`p-6 rounded-[24px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>TMB</div>
                           <div className={`text-2xl font-mono ${isLightMode ? 'text-black' : 'text-white'}`}>{Math.floor(plan.tmb)} <small className="text-[10px]">kcal</small></div>
                        </div>
                        <div className={`p-6 rounded-[24px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>TDEE</div>
                           <div className={`text-2xl font-mono ${isLightMode ? 'text-black' : 'text-white'}`}>{Math.floor(plan.tdee)} <small className="text-[10px]">kcal</small></div>
                        </div>
                        <div className={`p-6 rounded-[24px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>OBJETIVO</div>
                           <div className="text-[10px] font-black italic text-wellness-green leading-tight">{plan.biotype.toUpperCase()} / {plan.biotypeDescription.substring(0, 15)}...</div>
                        </div>
                     </div>
                  </div>

                  {/* Reset Button */}
                  <div className="mt-10">
                    <button 
                      onClick={() => onReset()}
                      className="w-full py-6 rounded-[28px] border border-wellness-green/30 text-wellness-green font-black uppercase tracking-widest hover:bg-wellness-green hover:text-black transition-all text-[10px] italic shadow-xl shadow-wellness-green/10"
                    >
                      SALVAR E REINICIAR PROTOCOLO
                    </button>
                  </div>
               </div>
            </div>

            {/* Nova Seção de Conta */}
            <div className={`glass-card p-5 md:p-10 rounded-[28px] md:rounded-[48px] ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
               <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Gerenciamento de Conta</h3>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLightMode ? 'bg-black/5 text-black/40' : 'bg-white/5 text-white/40'}`}>
                        <LogOut className="w-6 h-6" />
                     </div>
                     <div>
                        <div className={`text-sm font-bold uppercase tracking-widest ${isLightMode ? 'text-black' : 'text-white'}`}>Encerrar Sessão</div>
                        <div className={`text-[10px] font-bold uppercase mt-0.5 ${isLightMode ? 'text-black/20' : 'text-white/30'}`}>LOGOUT SEGURO DO PROTOCOLO</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => onLogout()}
                    className={`px-10 py-4 rounded-full border font-black uppercase tracking-widest transition-all text-[10px] flex items-center gap-2 ${
                      isLightMode 
                      ? 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' 
                      : 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    SAIR DA CONTA
                  </button>
               </div>
            </div>

             {/* Histórico Section */}
             <div className={`pt-8 md:pt-12 border-t space-y-8 mt-8 md:mt-12 ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
           <div className="flex items-center justify-between px-2 md:px-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-wellness-green/10 flex items-center justify-center text-wellness-green shrink-0">
                   <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h2 className={`text-xl md:text-3xl font-bold tracking-tighter uppercase italic ${isLightMode ? 'text-black' : 'text-white'}`}>Protocolos Arquivados</h2>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>{history.length} SALVOS</span>
           </div>

           {history.length === 0 ? (
             <div className={`glass-card p-10 md:p-20 rounded-[28px] md:rounded-[48px] border-dashed flex flex-col items-center justify-center text-center opacity-50 ${isLightMode ? 'border-black/10' : 'border-white/5'}`}>
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 ${isLightMode ? 'border-black/10' : 'border-white/10'}`}>
                   <Info className={`w-8 h-8 ${isLightMode ? 'text-black/20' : 'text-white/20'}`} />
                </div>
                <h3 className={`text-xs font-bold uppercase tracking-widest ${isLightMode ? 'text-black/40' : 'text-white/40'}`}>Nenhum protocolo anterior</h3>
                <p className={`text-[10px] uppercase mt-2 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Seus planos antigos aparecerão aqui quando você reiniciar seu perfil.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-4">
               {history.map((h, idx) => (
                 <motion.div 
                   key={idx}
                   className={`glass-card p-8 rounded-[32px] ${isLightMode ? 'border-black/5 bg-black/5' : 'border-white/5'}`}
                 >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-wellness-green/10 flex items-center justify-center text-wellness-green border border-wellness-green/20">
                         <span className="font-black italic text-lg leading-none">#{history.length - idx}</span>
                       </div>
                       <div>
                         <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isLightMode ? 'text-black/30' : 'text-white/20'}`}>
                           {new Date(h.timestamp || Date.now()).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                         </div>
                         <h4 className={`text-xl font-bold tracking-tight uppercase ${isLightMode ? 'text-black' : 'text-white'}`}>
                           {h.biotype}
                         </h4>
                       </div>
                     </div>
 
                     <div className="flex flex-wrap gap-4">
                        <div className={`px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>IMC</span>
                           <span className="text-xs font-black italic text-wellness-green">{Math.floor(h.imc)}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Calorias</span>
                           <span className={`text-xs font-black italic ${isLightMode ? 'text-black' : 'text-white'}`}>{h.dailyCalories} kcal</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px] ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
                           <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Treinos</span>
                           <span className={`text-xs font-black italic ${isLightMode ? 'text-black' : 'text-white'}`}>{h.weeklyWorkout?.filter(d => d.exercises.length > 0).length}x/sem</span>
                        </div>
                     </div>
                   </div>
                  </motion.div>
               ))}
             </div>
           )}
        </div>
      </motion.div>
    )}
    </AnimatePresence>

      {/* Tab Navigation at the bottom of page flow */}
      <nav className={`w-full border-t mt-8 md:mt-16 px-2 md:px-4 py-4 md:py-6 flex justify-center transition-all duration-300 ${isLightMode ? 'bg-white border-black/10' : 'bg-wellness-charcoal/30 border-white/5 rounded-[24px] md:rounded-[32px]'}`}>
        <div className="flex justify-around items-center w-full max-w-lg gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tab);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className={`flex flex-col items-center gap-1 px-3 md:px-5 py-2 rounded-[20px] transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-wellness-green text-black scale-105 shadow-lg shadow-wellness-green/20 font-bold' 
                : isLightMode ? 'text-black/40 hover:text-black/70 hover:bg-black/5' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px] font-black tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
);
}
