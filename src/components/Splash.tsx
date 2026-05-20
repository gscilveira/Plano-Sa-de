import { motion } from "motion/react";
import { Activity } from "lucide-react";

export default function Splash({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-wellness-charcoal flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      {/* Background Pulse */}
      <motion.div 
        className="absolute w-[500px] h-[500px] bg-wellness-green/10 blur-[120px] rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8 
          }}
          className="w-24 h-24 rounded-3xl bg-wellness-green flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(5,150,105,0.4)]"
        >
          <Activity className="text-black w-12 h-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold tracking-tighter text-white mb-2">
            Plano<span className="text-wellness-green">&</span>Saúde
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-8 bg-wellness-green/30" />
             <span className="text-[10px] font-black tracking-[0.2em] text-wellness-green uppercase">
               Monte seu plano perfeito
             </span>
             <div className="h-[1px] w-8 bg-wellness-green/30" />
          </div>
        </motion.div>

        <motion.div 
          className="absolute -bottom-24 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-wellness-green"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              />
           </div>
           <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
             Iniciando Sistema de Bio-Performance v3.0...
           </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
