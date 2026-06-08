import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  CheckCircle2, 
  Play, 
  BarChart3, 
  Sparkles, 
  ChevronDown, 
  Heart, 
  Bolt,
  Activity,
  Users,
  Award,
  Zap,
  Layers,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";

interface LandingPageProps {
  setView: (view: "landing" | "workspace") => void;
  setWorkspacePreset?: (presetName: string) => void;
}

// Custom Counter Component for scroll-based animation
function StatCounter({ target, suffix = "" }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 1500; // ms
    const increment = target / (duration / 16); // 60fps approx
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <div ref={elementRef} className="font-mono text-4xl md:text-5xl font-extrabold text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.15)]">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function LandingPage({ setView, setWorkspacePreset }: LandingPageProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handlePresetSelect = (preset: string) => {
    if (setWorkspacePreset) {
      setWorkspacePreset(preset);
    }
    setView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollDirect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const faqs = [
    {
      q: "¿Cómo funciona la IA de Nexus?",
      a: "Nuestra IA analiza los objetivos del proyecto, la prioridad de las tareas y los recursos disponibles. Mediante redes neuronales, estima tiempos reales basándose en históricos y predice anomalías o riesgos de retraso antes de que afecten a tu cronograma."
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Absolutamente. Nexus cifra el 100% de la información tanto en reposo (AES-256) como en tránsito (TLS 1.3). Cumplimos con estándares de seguridad SOC2 y RGPD para que la PI de tu producto esté completamente inaccesible a ojos externos."
    },
    {
      q: "¿Puedo migrar desde otras herramientas?",
      a: "Sí. Nexus cuenta con importadores instantáneos para Jira, Trello, Asana y Notion. Al conectar tu cuenta, importaremos el backlog completo, los estados de las tareas, los comentarios e incluso el historial de asignaciones pasadas en menos de 5 minutos."
    },
    {
      q: "¿El plan Starter es realmente gratuito para siempre?",
      a: "Sí, el plan Starter es gratuito sin límite de tiempo para hasta 3 proyectos y miembros de equipo individuales. No requiere registrar tarjeta de crédito."
    }
  ];

  return (
    <div className="bg-[#0A0A0F] text-[#e4e1ed] overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-radial from-indigo-900/15 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[800px] left-0 w-80 h-80 bg-purple-900/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[2200px] right-0 w-96 h-96 bg-indigo-950/15 blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section id="producto" className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Animated Tech Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-indigo-500/20 mb-8 cursor-pointer hover:border-indigo-500/40 transition-colors"
            onClick={() => handlePresetSelect("ecommerce")}
          >
            <span className="text-indigo-400 font-mono text-xs font-semibold tracking-wider">✦ NUEVO</span>
            <span className="text-stone-300 font-sans text-xs">Nexus AI — Automatización predictiva</span>
          </motion.div>

          {/* Main Display Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-sans font-extrabold text-4xl sm:text-5xl md:text-7xl max-w-5xl mx-auto mb-6 leading-tight tracking-tight text-white"
          >
            Gestiona proyectos con <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">inteligencia artificial</span>
          </motion.h1>

          {/* Core Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-sans text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Nexus elimina el trabajo administrativo pesado. Automatiza flujos, predice retrasos y permite que tu equipo se concentre en lo que realmente importa: crear.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
          >
            <button 
              onClick={() => handlePresetSelect("ecommerce")}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer text-base border border-indigo-400/20"
            >
              Empezar Gratis
            </button>
            <button 
              onClick={() => setView("workspace")}
              className="w-full sm:w-auto px-8 py-4 bg-stone-900/60 hover:bg-stone-800 text-white font-bold rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-4.5 h-4.5 fill-current text-indigo-400" />
              Probar el Workspace
            </button>
          </motion.div>

          {/* Interactive Hero Mockup View */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.6 }}
            className="max-w-5xl mx-auto relative group cursor-pointer"
            onClick={() => setView("workspace")}
          >
            {/* Soft glowing backlight effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />
            
            <div className="relative bg-stone-950/70 rounded-2xl p-2.5 shadow-2xl border border-white/15 backdrop-blur-md">
              <div className="bg-stone-900/40 rounded-xl overflow-hidden border border-white/5 aspect-[21/9] flex flex-col">
                {/* Mock Browser Header */}
                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-stone-950/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] text-stone-500 tracking-widest uppercase">
                    NEXUS_DASHBOARD_LIVE_VER.3.5
                  </div>
                  <div className="w-12 h-2 bg-white/5 rounded-full"></div>
                </div>

                {/* Mock Content */}
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-48 border-r border-white/5 p-4 hidden md:block text-left bg-stone-950/15">
                    <div className="space-y-4">
                      <div className="h-4 w-32 bg-indigo-500/15 border border-indigo-500/20 rounded flex items-center px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"></div>
                        <div className="h-1.5 w-12 bg-indigo-400/50 rounded"></div>
                      </div>
                      <div className="h-4 w-28 bg-white/5 rounded"></div>
                      <div className="h-4 w-20 bg-white/5 rounded"></div>
                      <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                        <div className="h-3 w-28 bg-white/5 rounded"></div>
                        <div className="h-3 w-24 bg-white/5 rounded"></div>
                        <div className="h-3 w-26 bg-white/5 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 text-left">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="col-span-2 space-y-4">
                        <div className="bg-stone-900/60 rounded-xl p-4 border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-4 w-44 bg-indigo-400/20 rounded"></div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">ESTABLE</span>
                          </div>
                          <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400 w-3/4"></div>
                          </div>
                          <div className="flex justify-between mt-3 text-[10px] font-mono text-stone-400">
                            <span>Sprints Completados: 4/5</span>
                            <span>Riesgo AI: 12%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-18 bg-stone-900/30 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                            <div className="h-2.5 w-12 bg-white/10 rounded"></div>
                            <div className="h-4 w-20 bg-indigo-400/45 rounded"></div>
                          </div>
                          <div className="h-18 bg-stone-900/30 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                            <div className="h-2.5 w-16 bg-white/10 rounded"></div>
                            <div className="h-4 w-12 bg-purple-400/40 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 bg-stone-900/60 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="h-3 w-20 bg-indigo-400/20 rounded mb-4"></div>
                          <div className="space-y-2.5">
                            <div className="h-1.5 w-full bg-white/5 rounded"></div>
                            <div className="h-1.5 w-[85%] bg-white/5 rounded"></div>
                            <div className="h-1.5 w-[90%] bg-white/5 rounded"></div>
                          </div>
                        </div>
                        <div className="h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 hover:bg-indigo-500/15 duration-200">
                          <Sparkles className="w-3.5 h-3.5" />
                          Mejorar Flujo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Interactivity prompt */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950/90 text-white border border-indigo-500/40 px-6 py-3 rounded-full text-xs font-semibold font-sans flex items-center gap-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              Haz clic para iniciar el Workspace Interactivo
            </div>
          </motion.div>

        </div>
      </section>

      {/* TRUSTED LOGOS SECTION */}
      <section className="py-12 border-t border-b border-stone-800/60 bg-stone-950/20 relative" id="clientes">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <p className="text-center font-mono text-stone-500 text-xs tracking-widest uppercase font-semibold">
            Confiado por equipos de clase mundial
          </p>
        </div>
        {/* Infinite Scroll Marquee using standard flex animations */}
        <div className="flex overflow-hidden select-none relative w-full">
          <div className="flex gap-16 md:gap-24 items-center animate-[scroll_25s_linear_infinite] whitespace-nowrap">
            {["TechFlow", "VERTEX", "Meridian", "ALTITUDE", "Quantum", "Aether", "TechFlow", "VERTEX", "Meridian", "ALTITUDE", "Quantum", "Aether"].map((logo, idx) => (
              <span
                key={idx}
                className="text-stone-600 hover:text-stone-400 font-sans font-black text-2xl md:text-3xl tracking-widest transition-colors cursor-pointer"
              >
                {logo}
              </span>
            ))}
          </div>
          <div className="flex gap-16 md:gap-24 items-center animate-[scroll_25s_linear_infinite] whitespace-nowrap absolute top-0" style={{ transform: "translateX(100%)", animationPlayState: "inherit" }}>
            {["TechFlow", "VERTEX", "Meridian", "ALTITUDE", "Quantum", "Aether", "TechFlow", "VERTEX", "Meridian", "ALTITUDE", "Quantum", "Aether"].map((logo, idx) => (
              <span
                key={idx}
                className="text-stone-600 hover:text-stone-400 font-sans font-black text-2xl md:text-3xl tracking-widest transition-colors cursor-pointer"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-24 md:py-32 max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Feature 1: Intelligent Automation */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6 fill-indigo-400/20" />
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight">
              Automatización inteligente
            </h2>
            <p className="text-stone-400 text-base md:text-lg leading-relaxed">
              Nexus aprende de tu flujo de trabajo. Detecta patrones repetitivos y sugiere automatizaciones personalizadas para liberar a tu equipo de tareas redundantes.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-stone-300 text-sm md:text-base">Asignación automática de tareas basada en carga de trabajo</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-stone-300 text-sm md:text-base">Notificaciones predictivas sobre posibles cuellos de botella</span>
              </li>
            </ul>
          </div>

          <div className="order-1 md:order-2 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl p-6 border border-white/10 h-[380px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-xl group">
            <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 duration-700 pointer-events-none" />
            
            <div className="w-full max-w-sm space-y-4 relative z-10">
              <div className="bg-stone-900 border border-white/5 rounded-xl p-4 translate-y-3 hover:translate-y-0 transition-transform duration-500 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="h-2 w-32 bg-stone-700 rounded-full"></div>
                </div>
                <div className="h-1.5 w-4/5 bg-stone-800 rounded-full mt-4"></div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 scale-102 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-2">
                    <Bolt className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                    <div className="h-2.5 w-40 bg-indigo-400/30 rounded-full"></div>
                  </div>
                  <span className="font-mono text-[9px] text-indigo-400 tracking-wider">AI RECOMMENDATION</span>
                </div>
                <div className="h-2 w-5/6 bg-indigo-400/15 rounded-full mt-4"></div>
                <div className="h-2 w-3/4 bg-indigo-400/10 rounded-full mt-2"></div>
              </div>

              <div className="bg-stone-950/80 border border-white/5 rounded-xl p-4 -translate-y-3 hover:translate-y-0 transition-transform duration-500 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="h-2 w-20 bg-stone-700 rounded-full"></div>
                </div>
                <div className="h-1.5 w-full bg-stone-800 rounded-full mt-4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Real-time Reports */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl p-6 border border-white/10 h-[380px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-xl group">
            <div className="absolute inset-0 bg-radial from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 duration-700 pointer-events-none" />
            
            <div className="w-full max-w-sm space-y-6 relative z-10 px-4">
              <div className="flex items-end justify-between gap-2.5 h-36">
                {[45, 75, 55, 95, 65, 80].map((val, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center gap-2">
                    <div className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 duration-300">{val}%</div>
                    <div className="w-full bg-stone-900 rounded-t-sm h-32 flex items-end overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="w-full bg-gradient-to-t from-indigo-600/50 to-purple-400/70 inline-block shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-stone-800"></div>
              <div className="flex justify-between px-2 text-[10px] text-stone-500 font-mono">
                <span>SEMANA 1</span>
                <span>SEMANA 3</span>
                <span>SEMANA 6</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight">
              Reportes en tiempo real
            </h2>
            <p className="text-stone-400 text-base md:text-lg leading-relaxed">
              No esperes al final del mes para saber cómo va el proyecto. Obtén visualizaciones dinámicas del progreso, el presupuesto estimado y el rendimiento del equipo de forma instantánea.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-stone-300 text-sm md:text-base">Dashboards personalizados para cada departamento</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span className="text-stone-300 text-sm md:text-base">Exportación instantánea a PDF / CSV e integraciones dinámicas</span>
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* KEY STATS BAR */}
      <section className="py-20 relative bg-indigo-950/20 border-t border-b border-indigo-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            <div className="space-y-2">
              <StatCounter target={10000} suffix="+" />
              <div className="text-xs font-mono tracking-widest text-[#c7c4d7]/70 uppercase">Equipos Activos</div>
            </div>
            <div className="space-y-2">
              <StatCounter target={98} suffix="%" />
              <div className="text-xs font-mono tracking-widest text-[#c7c4d7]/70 uppercase">Satisfacción</div>
            </div>
            <div className="space-y-2">
              <StatCounter target={50} suffix="M+" />
              <div className="text-xs font-mono tracking-widest text-[#c7c4d7]/70 uppercase">Tareas Hechas</div>
            </div>
            <div className="space-y-2">
              <StatCounter target={24} suffix="h" />
              <div className="text-xs font-mono tracking-widest text-[#c7c4d7]/70 uppercase">Soporte Live</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SCHEME SECTION */}
      <section id="precios" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-6">
            Planes que crecen con vos
          </h2>
          
          {/* Billing Switch Selector */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? "text-white" : "text-stone-500"}`}>Mensual</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-stone-900 border border-stone-800 p-1 relative transition-colors focus:outline-none"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-indigo-500 shadow-md transition-transform duration-300 transform ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${isAnnual ? "text-white" : "text-stone-500"}`}>
              Anual 
              <span className="text-[10px] font-mono tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-400/20">
                -20%
              </span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            
            {/* Tier 1: Starter */}
            <div className="bg-stone-950/40 rounded-2xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 duration-200">
              <div className="font-mono text-xs text-stone-400 tracking-wider font-extrabold uppercase mb-4">STARTER</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-white text-5xl font-extrabold tracking-tight">$0</span>
                <span className="text-stone-500 text-sm">/mes</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed mb-8">
                Para individuos y freelancers que recién empiezan.
              </p>
              
              <div className="h-px bg-stone-800/60 mb-8"></div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {["Hasta 3 proyectos activos", "5 GB de Almacenamiento seguro", "Comunidad de Soporte", "Análisis y predicciones básicos"].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-stone-300 text-sm">
                    <Check className="w-4.5 h-4.5 text-stone-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setView("workspace")}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl border border-white/10 active:scale-95 transition-all text-sm cursor-pointer"
              >
                Empezar Gratis
              </button>
            </div>

            {/* Tier 2: PROFESSIONAL */}
            <div className="bg-stone-950/80 rounded-2xl p-8 border-2 border-indigo-500/40 flex flex-col h-full relative shadow-[0_0_50px_rgba(99,102,241,0.15)] transform md:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-mono text-[9px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase border border-indigo-400/20 shadow-md">
                MAS POPULAR
              </div>
              
              <div className="font-mono text-xs text-indigo-400 tracking-wider font-extrabold uppercase mb-4 mt-2">PROFESSIONAL</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-white text-5xl font-extrabold tracking-tight transition-all duration-300">
                  {isAnnual ? "$23" : "$29"}
                </span>
                <span className="text-stone-500 text-sm">/mes</span>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed mb-8">
                Para equipos en crecimiento que necesitan control total y predicciones AI.
              </p>
              
              <div className="h-px bg-stone-800/60 mb-8"></div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Proyectos y Sprints ILIMITADOS", 
                  "Nexus AI Copilot completo", 
                  "100 GB de Almacenamiento seguro", 
                  "Reportes predictivos avanzados",
                  "Integraciones fluidas con Jira/Notion",
                  "Soporte rápido en 24 horas"
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-stone-200 text-sm">
                    <Check className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePresetSelect("marketing")}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold rounded-xl border border-indigo-400/20 active:scale-95 transition-all text-sm cursor-pointer shadow-[0_4px_25px_rgba(99,102,241,0.3)] shadow-indigo-500/10"
              >
                Prueba Pro Gratis
              </button>
            </div>

            {/* Tier 3: ENTERPRISE */}
            <div className="bg-stone-950/40 rounded-2xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 duration-200">
              <div className="font-mono text-xs text-stone-400 tracking-wider font-extrabold uppercase mb-4">ENTERPRISE</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-white text-5xl font-extrabold tracking-tight">Custom</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed mb-8">
                Soluciones corporativas robustas a medida para grandes organizaciones.
              </p>
              
              <div className="h-px bg-stone-800/60 mb-8"></div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "SSO y Seguridad empresarial Avanzada", 
                  "Nexus AI Full Suite dedicada", 
                  "Capacidades de almacenamiento ILIMITADO", 
                  "Soporte exclusivo 24/7 con Account Manager",
                  "Acuerdo de Nivel de Servicio (SLA)",
                  "Customización de API bajo demanda"
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-stone-300 text-sm">
                    <Check className="w-4.5 h-4.5 text-indigo-300 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePresetSelect("enterprise_app")}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl border border-white/10 active:scale-95 transition-all text-sm cursor-pointer"
              >
                Contactar Ventas
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* REAL TESTIMONIALS */}
      <section className="py-24 bg-stone-950/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <h2 className="text-center font-sans font-bold text-3xl md:text-4xl text-white tracking-tight mb-16">
            Lo que dicen nuestros líderes
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Testimonial 1 */}
            <div className="relative bg-stone-950/80 border border-white/5 rounded-2xl p-6.5 hover:border-white/10 duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <img 
                    alt="Alejandro Rossi" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-indigo-500/20 object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8MRteiN6JiCtIpbTmfSYbHV9azJhJyV22a5tYULuAI-W8Mygxbi_kVijPkQMy7VwmoV0a43aPJ-xfeL4Niz5nKZiVQtWd3wT3pMIeUiIVimqV_vaqNrMXssS3uUGO7uO4qMVGEfOESzPb4-_JWBHEqw5HnQ223TbzDVhSj6XNGbqVdrEr49xLZ9tLK0-VKwRTRbx6Ju504KAJfcevYwnR6PasvwH1D3K3AjilgFQaBuYq1mQuboZmxlj4fHX0ZdNxLbGrwAnvEkZg"
                  />
                  <div>
                    <div className="font-bold text-white text-base">Alejandro Rossi</div>
                    <div className="text-stone-500 text-xs font-mono">CTO en TechFlow</div>
                  </div>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic">
                  "Nexus cambió radicalmente nuestra forma de iterar sprints. La inteligencia artificial predice retrasos precisos antes de que ocurran."
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="relative bg-stone-950/80 border border-white/5 rounded-2xl p-6.5 hover:border-white/10 duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <img 
                    alt="Sofía Mendez" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-indigo-500/20 object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfxIXnwYfcnFq2_-fdcu1wDWfnedMXnD-_U4kBXaMDt12BGT17aHOAS3lLytvD68B4u330evqClld6X7mENGI161LqPLCjVGm8GeDoRtKvXHqSNs4VdBcIbX7xRmQ_ggSPfEMLnYvhGWmiLik0l--D_O4H6eDkTC3OpF-Ej2a7ecRkIA5NXbsoHxmn-EcPmi-_WAWnuZRHHHxReWNT85tBESvkWcJSp4QpBdUr1THnJJj7MetZ1FmvkTJBztswvr5qH45mb_1XkzF"
                  />
                  <div>
                    <div className="font-bold text-white text-base">Sofía Mendez</div>
                    <div className="text-stone-500 text-xs font-mono">Directora de Producto</div>
                  </div>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic">
                  "La interfaz es simplemente hermosa e intuitiva. Ver reportes dinámicos de recursos en tiempo real es una maravilla absoluta para el roadmap."
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="relative bg-stone-950/80 border border-white/5 rounded-2xl p-6.5 hover:border-white/10 duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <img 
                    alt="Marcos Galperín" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-indigo-500/20 object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtuKy-WDi08W8kZajvAQg-QLLU8Fha_zIWs4rO9DzHaluNbgc_tnYAhUylyKmHcqHg2VUbQIvMITkd40ySgmX7A3L4ErGBunOfyp7lxum-5pt6mPgL1qLGyl9n1iWqKS0bHebqp8d5b-6qXbRtRGXHiRVzhDhjE7m-_-mf4VgnGKmTreaBtifN8mg2ZsIZ0sf1o9UMyH6G-OXZWKTCf6iGSUEk5gmoZqKNK-pj0DcQ6EdCo1bhTkU8hR4yw91ouvUD2T-TZjDFFYD8"
                  />
                  <div>
                    <div className="font-bold text-white text-base">Marcos Galperín</div>
                    <div className="text-stone-500 text-xs font-mono">Head of Design</div>
                  </div>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic">
                  "No hemos vuelto a abrir ninguna otra herramienta de planificación o gantts tradicionales desde que probamos Nexus. Rápida y fluida."
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CONVENIENT FAQ ACCORDION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-center font-sans font-bold text-3xl text-white tracking-tight mb-16">
          Preguntas frecuentes
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-stone-950/60 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 flex justify-between items-center text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-white text-base">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180" : ""
                    }`} 
                  />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 text-stone-400 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-6 mb-12">
        <div className="max-w-7xl mx-auto bg-stone-950/60 rounded-3xl p-8 md:p-16 relative overflow-hidden text-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-indigo-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              Empezá hoy. Gratis.
            </h2>
            <p className="text-stone-400 text-base md:text-lg leading-relaxed">
              Únete a más de 10,000 equipos que ya están revolucionando su forma de trabajar con la inteligencia artificial de Nexus.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => handlePresetSelect("ecommerce")}
                className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all text-base cursor-pointer"
              >
                Crear Cuenta Gratis
              </button>
              <button 
                onClick={() => setView("workspace")}
                className="px-8 py-4 bg-stone-900 border border-white/10 hover:bg-stone-800 text-white font-bold rounded-xl active:scale-95 transition-all text-base cursor-pointer"
              >
                Hablar con un experto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950/80 border-t border-stone-800/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 mb-12">
          
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/20">
                <Bolt className="w-4.5 h-4.5 fill-current" />
              </div>
              <span className="font-sans font-black text-xl tracking-tighter text-white">
                NEXUS
              </span>
            </div>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-xs">
              El futuro de la gestión de proyectos, impulsado por algoritmos predictivos e Inteligencia Artificial sofisticada.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Producto</h4>
            <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
              <li><button onClick={() => scrollDirect("producto")} className="hover:text-indigo-400 cursor-pointer">Funciones</button></li>
              <li><button onClick={() => scrollDirect("features")} className="hover:text-indigo-400 cursor-pointer">Marquee AI</button></li>
              <li><button onClick={() => setView("workspace")} className="hover:text-indigo-400 cursor-pointer text-indigo-300 font-semibold flex items-center gap-1">Workspace Dev ✦</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Compañía</h4>
            <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
              <li><a href="#" className="hover:text-indigo-400">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-indigo-400">Carreras</a></li>
              <li><a href="#" className="hover:text-indigo-400">Blog oficial</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Legal</h4>
            <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
              <li><a href="#" className="hover:text-indigo-400">Privacidad</a></li>
              <li><a href="#" className="hover:text-indigo-400">Términos</a></li>
              <li><a href="#" className="hover:text-indigo-400">Seguridad global</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <div>© 2026 NEXUS Technologies. Todos los derechos reservados.</div>
          <div className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> en Buenos Aires, Argentina
          </div>
        </div>
      </footer>

    </div>
  );
}
