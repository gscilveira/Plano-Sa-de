import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Objective, UserData } from "../types";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface FormProps {
  onSubmit: (data: UserData) => void;
  loading: boolean;
  isLightMode?: boolean;
}

export default function OnboardingForm({ onSubmit, loading, isLightMode }: FormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    weight: 75,
    height: 175,
    objective: Objective.HEALTHY_LIFESTYLE,
    gender: 'M'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 2));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateField = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 uppercase italic ${isLightMode ? 'text-black' : 'text-white'}`}
        >
          {step === 1 ? "MÉTRICAS" : "OBJETIVO"}
        </motion.h2>
        <p className="text-wellness-green text-[10px] tracking-[0.3em] uppercase font-bold">Fase de Análise {step}</p>
      </div>

      <div className="glass-card rounded-[40px] p-8 md:p-10 relative overflow-hidden border-white/5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-center gap-4">
                {['M', 'F'].map(g => (
                  <button
                    key={g}
                    onClick={() => updateField('gender', g)}
                    className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-widest border transition-all ${
                      formData.gender === g 
                      ? 'bg-wellness-green text-black border-wellness-green' 
                      : `hover:border-wellness-green/30 ${isLightMode ? 'bg-black/5 border-black/10 text-black/40' : 'bg-white/5 border-white/10 text-white/40'}`
                    }`}
                  >
                    {g === 'M' ? 'MASCULINO' : 'FEMININO'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Weight Input */}
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ml-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Peso Corporal (kg)</label>
                  <input 
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', Number(e.target.value))}
                    className={`w-full border rounded-3xl p-6 text-2xl font-mono text-wellness-green focus:border-wellness-green outline-none transition-all ${isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/5'}`}
                  />
                </div>

                {/* Height Input */}
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ml-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Estatura (cm)</label>
                  <input 
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateField('height', Number(e.target.value))}
                    className={`w-full border rounded-3xl p-6 text-2xl font-mono text-wellness-green focus:border-wellness-green outline-none transition-all ${isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/5'}`}
                  />
                </div>

                {/* Age Input */}
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ml-2 ${isLightMode ? 'text-black/30' : 'text-white/30'}`}>Idade (anos)</label>
                  <input 
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                    className={`w-full border rounded-3xl p-6 text-2xl font-mono text-wellness-green focus:border-wellness-green outline-none transition-all ${isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/5'}`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 gap-4"
            >
              {[Objective.WEIGHT_LOSS, Objective.MUSCLE_GAIN, Objective.HEALTHY_LIFESTYLE].map(obj => (
                <button
                  key={obj}
                  onClick={() => updateField('objective', obj)}
                  className={`p-8 rounded-[32px] border text-center transition-all group ${
                    formData.objective === obj 
                    ? 'bg-wellness-green border-wellness-green text-black scale-[1.02] shadow-xl' 
                    : `hover:border-wellness-green/30 ${isLightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'}`
                  }`}
                >
                  <h3 className="font-bold text-lg tracking-widest uppercase italic">{obj}</h3>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              className={`flex-1 flex items-center justify-center gap-2 py-6 rounded-[28px] transition-colors text-[10px] font-bold tracking-widest ${isLightMode ? 'bg-black/5 text-black/40 hover:bg-black/10' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            >
              <ChevronLeft className="w-4 h-4" /> VOLTAR
            </button>
          )}
          
          <button
            onClick={step === 2 ? () => onSubmit(formData) : nextStep}
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-2 py-6 rounded-[28px] bg-wellness-green text-black font-bold tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 text-[10px]"
          >
            {loading ? (
              <span className="flex gap-3 items-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                BIO-ANÁLISE EM CURSO...
              </span>
            ) : (
              <>
                {step === 2 ? "FINALIZAR AGORA" : "PRÓXIMA ETAPA"} <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
