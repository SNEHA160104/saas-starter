import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary/30">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-zinc-900/80 z-10" />
        
        {/* Animated background shapes */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[100px]" 
        />

        <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center max-w-xl">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 mb-8 shadow-2xl">
            <Rocket className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Build Faster.<br/>Scale Smarter.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            The ultimate SaaS starter kit. Multi-tenant ready, Stripe integrated, and built on an enterprise-grade monorepo architecture.
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Mobile decorative blobs */}
        <div className="absolute top-0 right-0 w-full h-full lg:hidden overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[80px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] flex flex-col space-y-6 bg-card/50 p-8 sm:p-10 rounded-3xl border border-border shadow-xl backdrop-blur-xl"
        >
          <div className="flex flex-col space-y-2 text-center mb-4">
            <Link to="/" className="flex items-center justify-center gap-2 mb-6 lg:hidden">
              <div className="bg-primary p-2 rounded-xl">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">SaaS Starter</span>
            </Link>
          </div>
          
          <Outlet />

        </motion.div>
      </div>
    </div>
  );
}
