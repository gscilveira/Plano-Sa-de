import { motion } from "motion/react";
import { ReactNode } from "react";
import { Activity } from "lucide-react";

export default function Layout({ children, isLightMode }: { children: ReactNode, isLightMode?: boolean }) {
  return (
    <div className={`min-h-screen wellness-gradient relative overflow-hidden bg-wellness-charcoal selection:bg-wellness-green selection:text-black transition-colors duration-500`}>
      {/* Decorative background elements */}
      {!isLightMode && (
        <>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-wellness-green/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-wellness-green/3 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </>
      )}
      
      <nav className={`relative z-10 border-b ${isLightMode ? 'border-black/5 bg-white' : 'border-white/5 bg-wellness-charcoal/50'} backdrop-blur-xl px-4 md:px-6 py-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 rounded-lg bg-wellness-green flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Activity className="text-black w-5 h-5" />
            </div>
            <span className={`font-bold text-lg md:text-xl tracking-tighter uppercase ${isLightMode ? 'text-black' : 'text-white'}`}>Plano<span className="text-wellness-green">&</span>Saúde</span>
          </div>

          <div className={`hidden md:flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase ${isLightMode ? 'text-black/40' : 'text-white/40'}`}>
             <span>Monte seu plano perfeito v3.0</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <div className="w-2 h-2 rounded-full bg-wellness-green animate-pulse" />
             <span className="hidden sm:block text-[10px] font-bold tracking-widest text-wellness-green">PROTOCOLO ATIVO</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 min-h-[calc(100vh-80px)]">
        {children}
      </main>
      
      <footer className={`relative z-10 border-t ${isLightMode ? 'border-black/5 text-black/30' : 'border-white/5 text-white/30'} py-8 text-center text-[10px] tracking-[0.2em] uppercase`}>
        © 2026 PLANO&SAÚDE WELLNESS TECHNOLOGIES. TODOS OS DIREITOS RESERVADOS.
      </footer>
    </div>
  );
}
