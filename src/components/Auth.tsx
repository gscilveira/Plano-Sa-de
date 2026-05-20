import React, { useState } from "react";
import { motion } from "motion/react";
import { Activity, Mail, Lock, User, ChevronRight, Fingerprint } from "lucide-react";

interface AuthProps {
  onAuth: (name: string, email: string) => void;
  isLightMode: boolean;
}

export default function AuthScreen({ onAuth, isLightMode }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulated Auth delay
    setTimeout(() => {
      const usersRaw = localStorage.getItem('vita_users');
      const users = usersRaw ? JSON.parse(usersRaw) : {};
      
      if (isLogin) {
        const user = users[formData.email];
        if (user && user.password === formData.password) {
          onAuth(user.name, formData.email);
        } else {
          setError("E-mail ou senha incorretos.");
          setLoading(false);
          return;
        }
      } else {
        // Registering
        if (users[formData.email]) {
          setError("Este e-mail já está registrado.");
          setLoading(false);
          return;
        }
        users[formData.email] = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        localStorage.setItem('vita_users', JSON.stringify(users));
        onAuth(formData.name, formData.email);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md glass-card rounded-[48px] p-10 border-wellness-green/10 shadow-2xl ${isLightMode ? 'bg-white' : ''}`}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-wellness-green/10 flex items-center justify-center mx-auto mb-4 border border-wellness-green/20">
            <Fingerprint className="text-wellness-green w-8 h-8" />
          </div>
          <h2 className={`text-3xl font-bold tracking-tight uppercase italic ${isLightMode ? 'text-black' : 'text-white'}`}>
            {isLogin ? 'Autenticação' : 'Registro de Bio-ID'}
          </h2>
          <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${isLightMode ? 'text-black/30' : 'text-wellness-green/50'}`}>
            Acesso ao Protocolo Plano&Saúde
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold text-center uppercase tracking-widest leading-none">
              {error}
            </div>
          )}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 overflow-hidden"
            >
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-wellness-green" />
                <input
                  required
                  type="text"
                  placeholder="NOME DE USUÁRIO"
                  className={`w-full bg-black/5 ${isLightMode ? 'border-black/5' : 'border-white/5'} border rounded-3xl py-5 pl-14 pr-6 text-xs font-bold tracking-widest focus:border-wellness-green outline-none transition-all`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-wellness-green" />
              <input
                required
                type="email"
                placeholder="E-MAIL"
                className={`w-full bg-black/5 ${isLightMode ? 'border-black/5' : 'border-white/5'} border rounded-3xl py-5 pl-14 pr-6 text-xs font-bold tracking-widest focus:border-wellness-green outline-none transition-all`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-wellness-green" />
              <input
                required
                type="password"
                placeholder="SENHA"
                className={`w-full bg-black/5 ${isLightMode ? 'border-black/5' : 'border-white/5'} border rounded-3xl py-5 pl-14 pr-6 text-xs font-bold tracking-widest focus:border-wellness-green outline-none transition-all`}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 mt-4 rounded-3xl bg-wellness-green text-black font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center gap-3 shadow-xl shadow-wellness-green/20"
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              <>
                {isLogin ? 'ENTRAR NO SISTEMA' : 'CRIAR BIO-ID'} <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isLightMode ? 'text-black/40 hover:text-black' : 'text-white/30 hover:text-white'}`}
          >
            {isLogin ? 'Não tem uma conta? Registrar nova ID' : 'Já possui Bio-ID? Acessar terminal'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
