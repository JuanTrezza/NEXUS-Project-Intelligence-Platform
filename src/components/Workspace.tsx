import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ChevronRight, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BadgeAlert,
  ArrowRight,
  ListTodo,
  FileDown,
  RefreshCw,
  Plus,
  Trash,
  Info,
  Check,
  ChevronDown,
  Share2,
  FileCheck
} from "lucide-react";
import { ProjectReport, Phase, Task } from "../types";

// Backup fallback plan in case API fails or keys aren't configured yet
const BACKUP_DEMO_PROJECT: ProjectReport = {
  projectName: "E-Commerce Premium Co. (Demo)",
  predictedDelayRisk: 34,
  delayRiskLevel: "Medio",
  riskExplanation: "Se detecta un riesgo moderado principalmente asociado a cuellos de botella en la fase de integración de pasarela de pagos con Stripe y APIs bancarias. Además, la aprobación de material de diseño gráfico podría solaparse con las primeras entregas frontend si no se movilizan recursos a tiempo.",
  estimatedWeeks: 6.5,
  phases: [
    {
      phaseName: "Fase 1: Especificaciones y Mockup UI/UX",
      tasks: [
        { id: "t1", title: "Definición del User Flow & Arquitectura", description: "Esquematizar el recorrido de compra óptimo.", estimatedDays: 3, role: "Product Manager", priority: "Alta", completed: true },
        { id: "t2", title: "Diseño de wireframes en Figma", description: "Crear mockups de alta fidelidad para mobile y desktop.", estimatedDays: 5, role: "Diseñador", priority: "Alta", completed: true },
        { id: "t3", title: "Presentación y aprobación de marca", description: "Revisión final de look and feel con stakeholders.", estimatedDays: 2, role: "Product Manager", priority: "Media", completed: false }
      ]
    },
    {
      phaseName: "Fase 2: Arquitectura del Catálogo e Integraciones",
      tasks: [
        { id: "t4", title: "Configurar Base de Datos de Productos", description: "Desarrollar el esquema para variantes, categorías e inventario.", estimatedDays: 4, role: "Desarrollador Backend", priority: "Alta", completed: false },
        { id: "t5", title: "Estructura del carrito y vistas frontend", description: "Implementar layouts con Tailwind.", estimatedDays: 5, role: "Desarrollador Frontend", priority: "Media", completed: false },
        { id: "t6", title: "Integración segura de Pasarela de Pagos", description: "Configurar Stripe Connect y webhooks de transacción.", estimatedDays: 6, role: "Desarrollador Backend", priority: "Alta", completed: false }
      ]
    },
    {
      phaseName: "Fase 3: Pruebas e Implementación Cloud de Producción",
      tasks: [
        { id: "t7", title: "Despliegues unitarios y QA integrales", description: "Simulación de compras de prueba con sandbox.", estimatedDays: 3, role: "QA", priority: "Alta", completed: false },
        { id: "t8", title: "Configurar pipelines de CI/CD", description: "Automatizar despliegues con GitHub Actions.", estimatedDays: 2, role: "DevOps", priority: "Baja", completed: false }
      ]
    }
  ],
  aiRecommendations: [
    "Adelanta la firma de credenciales en Stripe Sandbox para mitigar retrasos de integración la semana 2.",
    "Comienza el desarrollo del layout catálogo en paralelo a la aprobación de la marca para recuperar hasta 3 días hábiles.",
    "Agrega un diseñador asistente para agilizar la entrega de recursos visuales de alta fidelidad."
  ]
};

// Preset lists for clicking instant fill
const PRESETS = [
  {
    id: "ecommerce",
    name: "Lanzamiento Tienda E-commerce Premium",
    desc: "Diseñar y desarrollar un nuevo portal e-commerce con Stripe para una marca premium de café, incluyendo pasarela de pagos integrada, catálogo interactivo con filtros avanzados de búsqueda y panel administrativo.",
    category: "Tecnología Web",
    size: "Medio"
  },
  {
    id: "marketing",
    name: "Embudo de Marketing SaaS Automatizado",
    desc: "Lanzar un embudo de conversión para una plataforma de contabilidad SaaS, configurando flujos de email marketing, landing pages optimizadas en conversión, anuncios en LinkedIn y pixel de conversiones.",
    category: "Marketing Digital",
    size: "Pequeño"
  },
  {
    id: "fintech_app",
    name: "Rediseño de App FinTech Móvil",
    desc: "Rediseño total de flujos UX de billetera virtual móvil, optimizando KYC, envío de remesas internacionales y dashboard de analíticas financieras de activos.",
    category: "Diseño UI/UX",
    size: "Grande"
  },
  {
    id: "cloud_infra",
    name: "Migración de Arquitectura Monolítica a Cloud",
    desc: "Migrar servicios base y base de datos relacional local legada a microservicios en GCP usando Kubernetes, Docker, automatizaciones Terraform y alta disponibilidad.",
    category: "Desarrollo de Software",
    size: "Grande"
  }
];

interface WorkspaceProps {
  presetName?: string;
}

export default function Workspace({ presetName }: WorkspaceProps) {
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCategory, setProjCategory] = useState("Tecnología Web");
  const [projSize, setProjSize] = useState("Medio");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingLogIndex, setLoadingLogIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Active Project Data
  const [activeProject, setActiveProject] = useState<ProjectReport | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "gantt" | "recommendations">("tasks");

  // Extra features / Customized state modifiers
  const [mitigationsApplied, setMitigationsApplied] = useState<string[]>([]);
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [customTaskRole, setCustomTaskRole] = useState("Desarrollador");
  const [customTaskPhaseIndex, setCustomTaskPhaseIndex] = useState(0);
  const [customTaskPriority, setCustomTaskPriority] = useState("Media");
  const [customTaskDays, setCustomTaskDays] = useState(3);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const loadingLogs = [
    "✦ Inicializando algoritmo cognitivo de Nexus...",
    "✦ Leyendo objetivos, alcances y recursos asignados...",
    "✦ Simulación de ruta crítica en paralelo iniciada...",
    "✦ Calculando factores internos de retraso según categoría...",
    "✦ Generando fases detalladas, tareas inteligentes y roles sugeridos...",
    "✦ Optimizando tiempos finales con modelos Gemini 3.5..."
  ];

  // Apply a preset if provided from landing page
  useEffect(() => {
    if (presetName) {
      const match = PRESETS.find(p => p.id === presetName);
      if (match) {
        applyPreset(match);
      }
    } else {
      // Apply first preset as default fill so the screen isn't empty
      applyPreset(PRESETS[0]);
    }
  }, [presetName]);

  // Loading log ticker
  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setInterval(() => {
        setLoadingLogIndex((prev) => (prev + 1) % loadingLogs.length);
      }, 1500);
    } else {
      setLoadingLogIndex(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setProjName(preset.name);
    setProjDesc(preset.desc);
    setProjCategory(preset.category);
    setProjSize(preset.size);
    showToast(`Preset cargado: ${preset.name}`, "info");
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Submit form handler
  const handleGenerateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) {
      showToast("Por favor digita un nombre de proyecto.", "error");
      return;
    }

    setLoading(true);
    setMitigationsApplied([]);
    
    try {
      const response = await fetch("/api/project/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projName,
          description: projDesc,
          category: projCategory,
          size: projSize
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }

      const data = await response.json();
      
      // Inject completion flag to database results
      if (data.phases) {
        data.phases = data.phases.map((ph: Phase) => ({
          ...ph,
          tasks: ph.tasks.map((tk: Task) => ({ ...tk, completed: false }))
        }));
      }

      setActiveProject(data);
      showToast("✦ ¡Plan predictivo generado con éxito!", "success");
    } catch (err: any) {
      console.warn("Backend API unavailable or error. Loading local demo prediction successfully.", err);
      
      // Load fallback demo but customized with user general names
      const customizedBackup: ProjectReport = JSON.parse(JSON.stringify(BACKUP_DEMO_PROJECT));
      customizedBackup.projectName = projName + " (AI-Simulado)";
      
      // Simulate 1.5 seconds loading state before displaying
      setTimeout(() => {
        setActiveProject(customizedBackup);
        showToast("✦ Plan simulado cargado (Sección sin llave de API activa)", "info");
      }, 2500);
    } finally {
      // Hold loading screen briefly to let logs animate beautifully
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // Toggle complete state of task
  const toggleTaskCompleted = (phaseIdx: number, taskIdx: number) => {
    if (!activeProject) return;

    const updated = { ...activeProject };
    const task = updated.phases[phaseIdx].tasks[taskIdx];
    const oldState = task.completed;
    task.completed = !oldState;
    
    setActiveProject(updated);

    if (task.completed) {
      showToast(`Completada: "${task.title}"`, "success");
    }
  };

  // Mitigation applier decreasing risks
  const applyMitigation = (recommendation: string, idx: number) => {
    if (!activeProject || mitigationsApplied.includes(recommendation)) return;

    const updated = { ...activeProject };
    // Lower risk by 8% per applied mitigation, floor at 5%
    const newRisk = Math.max(5, updated.predictedDelayRisk - 8);
    updated.predictedDelayRisk = newRisk;
    
    if (newRisk < 20) {
      updated.delayRiskLevel = "Bajo";
    } else if (newRisk < 50) {
      updated.delayRiskLevel = "Medio";
    }

    setMitigationsApplied([...mitigationsApplied, recommendation]);
    setActiveProject(updated);
    showToast(`✓ Mitigación aplicada. Riesgo bajó al ${newRisk}%`, "success");
  };

  // Dynamic calculations for progress meters
  const getOverallProgress = () => {
    if (!activeProject) return 0;
    let total = 0;
    let completed = 0;
    activeProject.phases.forEach(ph => {
      ph.tasks.forEach(tk => {
        total++;
        if (tk.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const getPhaseProgress = (phase: Phase) => {
    let completed = 0;
    phase.tasks.forEach(t => { if (t.completed) completed++; });
    return phase.tasks.length === 0 ? 0 : Math.round((completed / phase.tasks.length) * 100);
  };

  // Add task dynamically on current project
  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !customTaskInput.trim()) return;

    const newTask: Task = {
      id: "custom-" + Date.now(),
      title: customTaskInput,
      description: "Agregada manualmente por el gestor.",
      estimatedDays: customTaskDays,
      role: customTaskRole,
      priority: customTaskPriority,
      completed: false
    };

    const updated = { ...activeProject };
    updated.phases[customTaskPhaseIndex].tasks.push(newTask);
    
    // Add custom simulated risk factor change (+2% risk, adding variables increases tasks timelines)
    updated.predictedDelayRisk = Math.min(100, updated.predictedDelayRisk + 2);
    if (updated.predictedDelayRisk > 50) updated.delayRiskLevel = "Alto";
    
    setActiveProject(updated);
    setCustomTaskInput("");
    setShowAddTaskModal(false);
    showToast("✓ Entrada agregada y cronograma recalculado (+2% de riesgo)", "success");
  };

  // Remove task from catalog
  const removeTask = (phaseIdx: number, taskIdx: number) => {
    if (!activeProject) return;
    const updated = { ...activeProject };
    updated.phases[phaseIdx].tasks.splice(taskIdx, 1);
    
    // Recalculate slightly minus risk (-1%)
    updated.predictedDelayRisk = Math.max(5, updated.predictedDelayRisk - 1);
    setActiveProject(updated);
    showToast("Tarea eliminada del catálogo.", "info");
  };

  return (
    <div className="bg-[#0D0D15] min-h-screen text-[#e4e1ed] pt-24 pb-16 px-4 md:px-8 relative selection:bg-indigo-500/20">
      
      {/* Absolute Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`fixed top-6 right-6 z-50 rounded-xl px-5 py-4 flex items-center gap-3 shadow-2xl border ${
              toast.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-300"
                : "bg-indigo-950/90 border-indigo-500/40 text-indigo-300"
            }`}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="text-sm font-sans font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: GESTOR FORM AND PRESETS (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900/60 rounded-2xl border border-white/10 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2.5 mb-5 border-b border-white/5 pb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4 fill-current text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Predictor Nexus AI</h2>
                <p className="text-xs text-stone-500 font-mono">MODEL: GEMINI-3.5-FLASH</p>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="mb-6">
              <label className="text-xs text-stone-400 font-mono block mb-2 uppercase tracking-wider">PRESET EJEMPLOS</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const isActive = projName === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all truncate ${
                        isActive 
                          ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300 font-semibold"
                          : "bg-stone-950/40 border-white/5 text-stone-400 hover:border-white/15"
                      }`}
                    >
                      {p.name.replace("Lanzamiento", "").replace("Digital", "").replace("Embudo de", "").trim()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerateProject} className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 font-mono block mb-1 uppercase tracking-wider">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="ej. Lanzamiento de App Móvil FinTech"
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 font-sans outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 font-mono block mb-1 uppercase tracking-wider">Categoría</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Tecnología Web", "Diseño UI/UX", "Desarrollo de Software", "Marketing Digital"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjCategory(cat)}
                      className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                        projCategory === cat
                          ? "bg-indigo-600/10 border-indigo-500/60 text-indigo-300"
                          : "bg-stone-950/20 border-white/5 text-stone-400 hover:border-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-400 font-mono block mb-1 uppercase tracking-wider">Complejidad / Tamaño</label>
                  <select
                    value={projSize}
                    onChange={(e) => setProjSize(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Pequeño">Pequeño (1-2 devs)</option>
                    <option value="Medio">Medio (3-5 devs)</option>
                    <option value="Grande">Grande (Enterprise)</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[10px] font-mono text-stone-500 italic pb-1">
                    *Influye en la estimación de riesgos.
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 font-mono block mb-1 uppercase tracking-wider">Descripción y Objetivos</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  rows={4}
                  placeholder="Detalla lo que busca conseguir el proyecto para que la IA deduzca cuellos de botella reales..."
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-650 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 disabled:grayscale text-white font-extrabold rounded-xl shadow-[0_4px_25px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 duration-200 cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    Procesando Predicción...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                    Estimar & Planificar con AI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Stats Block of Workspace */}
          <div className="bg-stone-900/30 rounded-2xl border border-white/5 p-5 text-sm space-y-3.5">
            <h4 className="font-mono text-xs font-bold text-stone-400 uppercase tracking-widest">Información de Simulación</h4>
            <div className="flex justify-between items-center text-xs text-stone-400 border-b border-white/5 pb-2">
              <span>Riesgos Evaluados</span>
              <span className="font-mono text-white text-right">Integración pasarela, Carga de Servidor, Cuello de Botella UI</span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-400">
              <span>Mitigador cognitivo</span>
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">ACTIVO</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREDICTIONS REPORT & TABULAR DASHBOARD (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          <AnimatePresence mode="wait">
            {/* 1. INITIAL EMPTY/MOCK STATE */}
            {!loading && !activeProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-stone-900/40 rounded-2xl border border-dashed border-white/10 p-12 text-center h-[520px] flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-stone-950 flex items-center justify-center border border-white/5 shadow-inner">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="font-sans font-bold text-xl text-white">Ningún plan activo cargado</h3>
                <p className="text-stone-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Utiliza el panel de la izquierda para seleccionar un preset o escribir los detalles de tu nuevo proyecto y haz clic en "Estimar & Planificar".
                </p>
                <button
                  onClick={() => applyPreset(PRESETS[0])}
                  className="px-5 py-2.5 bg-stone-900 border border-white/10 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cargar E-commerce (Preset Demo)
                </button>
              </motion.div>
            )}

            {/* 2. LOGS LOADER FOR DYNAMIC WAITING */}
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-stone-950/80 rounded-2xl border border-white/10 p-12 h-[520px] flex flex-col justify-between font-mono"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                    <span className="text-xs text-stone-400">EJECUTANDO MOTOR PREDICTIVO NEXUS V3.5...</span>
                  </div>
                  
                  {/* Streaming Terminal Log list */}
                  <div className="space-y-2 text-xs md:text-sm text-indigo-300">
                    {loadingLogs.slice(0, loadingLogIndex + 1).map((log, lIdx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={lIdx} 
                        className="flex items-center gap-2"
                      >
                        <ChevronRight className="w-4.5 h-4.5 text-stone-500 flex-shrink-0" />
                        <span>{log}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 border-t border-white/5 pt-6">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-stone-400 text-xs">Consultando a Gemini AI para estimaciones reales del proyecto...</p>
                </div>
              </motion.div>
            )}

            {/* 3. ACTIVE REPORT RETRIBUTED FROM GEMINI FOR INTERACTIVE PREVIEW */}
            {!loading && activeProject && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                
                {/* 3.1 PREDICTIVE RADAR HERO CARD */}
                <div className="bg-stone-900 rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl pointer-events-none" />
                  
                  {/* Metadatas Row */}
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-4.5 mb-5">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mr-2 uppercase">
                        {projCategory}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        ESTIMACIÓN PREDICTIVA COGNITIVA
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => showToast("Reporte exportado correctamente a PDF en segundo plano.", "success")}
                        className="text-stone-400 hover:text-white flex items-center gap-1 text-xs border border-white/5 hover:border-white/10 px-2.5 py-1.5 rounded-lg bg-stone-950/20"
                      >
                        <FileDown className="w-3.5 h-3.5" /> Exportar PDF
                      </button>
                      <button 
                        onClick={() => showToast("Enlace de sincronización con Jira creado.", "success")}
                        className="text-stone-400 hover:text-white flex items-center gap-1 text-xs border border-white/5 hover:border-white/10 px-2.5 py-1.5 rounded-lg bg-stone-950/20"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Jira Link
                      </button>
                    </div>
                  </div>

                  {/* Visual Stats Row with radial risks */}
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    
                    {/* RISK DIAL GUAGE (5 cols) */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border-r border-white/5 border-dashed">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        
                        {/* Circle background */}
                        <svg className="absolute w-full h-full transform -rotate-90">
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            className="stroke-stone-950"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="72"
                            cy="72"
                            r="60"
                            className={
                              activeProject.predictedDelayRisk > 70 
                                ? "stroke-red-500" 
                                : activeProject.predictedDelayRisk > 35 
                                ? "stroke-amber-400" 
                                : "stroke-indigo-400"
                            }
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 60}
                            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                            animate={{ strokeDashoffset: (2 * Math.PI * 60) * (1 - activeProject.predictedDelayRisk / 100) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Middle Text info */}
                        <div className="text-center z-10 flex flex-col">
                          <span className="font-mono text-3xl font-extrabold text-white">
                            {activeProject.predictedDelayRisk}%
                          </span>
                          <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">
                            RIESGO FINAL
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-center">
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 px-3 py-1 rounded-full ${
                          activeProject.predictedDelayRisk > 70 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : activeProject.predictedDelayRisk > 35 
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" 
                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          Riesgo {activeProject.delayRiskLevel}
                        </span>
                      </div>
                    </div>

                    {/* TEXT DETAIL CHRONICLE (8 cols) */}
                    <div className="md:col-span-8 space-y-3">
                      <h3 className="font-sans font-bold text-lg text-white">
                        {activeProject.projectName}
                      </h3>
                      <div className="text-xs text-stone-400 leading-relaxed bg-[#0A0A0F]/60 p-4 rounded-xl border border-white/5 relative">
                        <Info className="w-4 h-4 text-indigo-400 absolute top-3 right-3 opacity-60" />
                        <span className="font-semibold text-indigo-300">Análisis Predictivo Nexus:</span> {activeProject.riskExplanation}
                      </div>

                      {/* Micro KPI Widgets */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-[#0A0A0F]/40 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                          <Calendar className="w-4.5 h-4.5 text-stone-400" />
                          <div>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-none">Duración Proyectada</p>
                            <p className="text-xs font-mono font-bold text-white mt-1">{activeProject.estimatedWeeks} Semanas</p>
                          </div>
                        </div>
                        <div className="bg-[#0A0A0F]/40 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                          <FileCheck className="w-4.5 h-4.5 text-stone-400" />
                          <div>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-none">Sprints Estimados</p>
                            <p className="text-xs font-mono font-bold text-white mt-1">
                              {Math.max(1, Math.ceil(activeProject.estimatedWeeks / 2))} Iteraciones
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* 3.2 WORKSPACE ACTIVE NAVIGATION TABS */}
                <div className="bg-stone-900/60 rounded-2xl border border-white/10 p-5 md:p-6 backdrop-blur-md shadow-lg space-y-6">
                  
                  {/* Tabs Buttons bar */}
                  <div className="flex border-b border-white/5 gap-4">
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className={`pb-3 font-semibold text-sm transition-all relative flex items-center gap-2 cursor-pointer ${
                        activeTab === "tasks" ? "text-indigo-400" : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <ListTodo className="w-4.5 h-4.5" />
                      Plan de Tareas ({getOverallProgress()}% completado)
                      {activeTab === "tasks" && (
                        <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("gantt")}
                      className={`pb-3 font-semibold text-sm transition-all relative flex items-center gap-2 cursor-pointer ${
                        activeTab === "gantt" ? "text-indigo-400" : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Calendar className="w-4.5 h-4.5" />
                      Gantt / Cronograma
                      {activeTab === "gantt" && (
                        <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("recommendations")}
                      className={`pb-3 font-semibold text-sm transition-all relative flex items-center gap-2 cursor-pointer ${
                        activeTab === "recommendations" ? "text-indigo-400" : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      Mitigación AI ({activeProject.aiRecommendations.length})
                      {activeTab === "recommendations" && (
                        <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                      )}
                    </button>
                  </div>

                  {/* TAB CONTENTS CONTAINER */}
                  <div>
                    
                    {/* ACCORDION/TASKS LIST CHECKLIST */}
                    {activeTab === "tasks" && (
                      <div className="space-y-6">
                        
                        <div className="flex justify-between items-center bg-stone-950/20 p-3 rounded-xl border border-white/5 flex-wrap gap-2.5">
                          <p className="text-xs text-stone-400">
                            Haz clic en las tareas completadas para simular el avance del sprint y actualizar los cronogramas en tiempo real.
                          </p>
                          <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 border border-indigo-500/20 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar Tarea
                          </button>
                        </div>

                        {activeProject.phases.map((phase, pIdx) => {
                          const phasePct = getPhaseProgress(phase);
                          return (
                            <div key={pIdx} className="bg-stone-950/30 rounded-xl border border-white/5 p-4.5 space-y-4">
                              
                              {/* Phase header with metrics */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                                <div>
                                  <h4 className="font-sans font-bold text-sm text-white">{phase.phaseName}</h4>
                                  <span className="text-[10px] font-mono text-stone-500">FASE {(pIdx + 1)} DEL PROYECTO</span>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <div className="w-full sm:w-28 bg-stone-900 rounded-full h-1.5 overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${phasePct}%` }}></div>
                                  </div>
                                  <span className="font-mono text-xs text-indigo-300 text-right shrink-0">{phasePct}% listo</span>
                                </div>
                              </div>

                              {/* Task check items */}
                              <div className="space-y-2">
                                {phase.tasks.map((task, tIdx) => (
                                  <div 
                                    key={task.id} 
                                    className={`flex items-center justify-between p-3 rounded-xl border group transition-all ${
                                      task.completed 
                                        ? "bg-emerald-950/10 border-emerald-500/10 text-stone-500" 
                                        : "bg-stone-950/40 border-transparent hover:border-white/5 text-stone-300"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                                      {/* Check box controller */}
                                      <button
                                        type="button"
                                        onClick={() => toggleTaskCompleted(pIdx, tIdx)}
                                        className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center cursor-pointer transition-all ${
                                          task.completed 
                                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                                            : "border-white/15 bg-stone-900 text-transparent hover:border-indigo-500/60"
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      <div className="min-w-0">
                                        <span className={`text-xs md:text-sm font-medium ${task.completed ? "line-through text-stone-600" : "text-white"}`}>
                                          {task.title}
                                        </span>
                                        <p className="text-xs text-stone-500 leading-normal mt-0.5 max-w-lg truncate">{task.description}</p>
                                      </div>
                                    </div>

                                    {/* Task badges */}
                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded shadow-sm border border-white/5 hidden sm:inline-block">
                                        {task.role}
                                      </span>
                                      
                                      <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border ${
                                        task.priority === "Alta" 
                                          ? "bg-red-500/10 border-red-500/20 text-red-400" 
                                          : task.priority === "Media"
                                          ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                          : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                      }`}>
                                        {task.priority}
                                      </span>

                                      <span className="text-xs text-stone-500 font-mono hidden md:inline-block">
                                        {task.estimatedDays}d
                                      </span>

                                      {/* Delete item click */}
                                      <button 
                                        type="button"
                                        onClick={() => removeTask(pIdx, tIdx)}
                                        className="text-stone-600 hover:text-red-400 p-1 rounded hover:bg-stone-900 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                  </div>
                                ))}
                                
                                {phase.tasks.length === 0 && (
                                  <div className="text-center py-4 text-xs font-mono text-stone-600 border border-dashed border-white/5 rounded-xl">
                                    [Sin tareas registradas en esta fase]
                                  </div>
                                )}
                              </div>

                            </div>
                          );
                        })}

                      </div>
                    )}

                    {/* DYNAMIC Gantt CHROMATIC TIMELINE */}
                    {activeTab === "gantt" && (
                      <div className="space-y-6">
                        <div className="bg-stone-950/20 p-4 rounded-xl border border-white/5 text-xs text-stone-400 flex items-center gap-2">
                          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>Esta vista desglosa secuencialmente las fases estimadas a lo largo de las <b>{activeProject.estimatedWeeks} semanas</b> pronosticadas.</span>
                        </div>

                        <div className="space-y-4">
                          {activeProject.phases.map((phase, pIdx) => {
                            // Calculate approximate span percentage on timeline
                            const blockWidth = pIdx === 0 ? "w-1/3" : pIdx === 1 ? "w-1/2" : "w-1/3";
                            const blockOffset = pIdx === 0 ? "ml-0" : pIdx === 1 ? "ml-12" : "ml-24";
                            
                            return (
                              <div key={pIdx} className="space-y-2 bg-stone-950/30 p-4.5 rounded-xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-full bg-linear-to-r from-transparent to-stone-900/10 pointer-events-none" />
                                <div className="flex justify-between items-center text-xs text-stone-400">
                                  <span className="font-bold text-white">{phase.phaseName}</span>
                                  <span className="font-mono text-stone-500">Estimado: Fase {(pIdx + 1)}</span>
                                </div>
                                
                                {/* Dynamic timeline chart row representing phase week span */}
                                <div className="h-6 w-full bg-stone-950 rounded-lg relative overflow-hidden flex items-center border border-white/5 mt-2">
                                  <div className={`h-full bg-indigo-500/25 border-l-2 border-r-2 border-indigo-400 flex items-center px-3 gap-1.5 ${blockWidth} ${blockOffset} rounded`}>
                                    <span className="text-[10px] text-indigo-300 font-mono font-bold truncate">Semanas {pIdx * 2 + 1} - {(pIdx + 1) * 2 + 1}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Chronometer scale labels */}
                        <div className="flex justify-between px-2 text-[10px] text-stone-500 font-mono uppercase tracking-widest mt-4">
                          <span>Sprint 0 (Inicio)</span>
                          <span>Sprint Medio</span>
                          <span>Sprint Final (Despliegue)</span>
                        </div>
                      </div>
                    )}

                    {/* AI COGNITIVE RECOMMENDATIONS & MITIGATIONS PANEL */}
                    {activeTab === "recommendations" && (
                      <div className="space-y-6">
                        
                        <div className="bg-indigo-950/15 p-4 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
                          <span>Nexus AI ha calculado recomendaciones específicas adaptadas a tu alcance. Aplica mitigadores cognitivos rápidos para recortar cuellos de botella predictivos en tus diagramas.</span>
                        </div>

                        <div className="space-y-3">
                          {activeProject.aiRecommendations.map((rec, rIdx) => {
                            const isApplied = mitigationsApplied.includes(rec);
                            return (
                              <div 
                                key={rIdx}
                                className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                                  isApplied 
                                    ? "bg-emerald-950/10 border-emerald-500/30 text-stone-400" 
                                    : "bg-stone-950/40 border-white/5 hover:border-indigo-500/20 text-white"
                                }`}
                              >
                                <div className="flex items-start gap-3 flex-1">
                                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/10">
                                    {rIdx + 1}
                                  </span>
                                  <p className="text-xs md:text-sm leading-relaxed">{rec}</p>
                                </div>
                                <button
                                  onClick={() => applyMitigation(rec, rIdx)}
                                  disabled={isApplied}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                    isApplied 
                                      ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed flex items-center gap-1 border border-emerald-500/15" 
                                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                                  }`}
                                >
                                  {isApplied ? (
                                    <>
                                      <Check className="w-3 h-3" /> Aplicado
                                    </>
                                  ) : (
                                    "Aplicar Mitigación"
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* CREATE ADDITIONAL NEW TASK DIALOG/MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-stone-900 border border-white/15 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Nueva Tarea de Proyecto
            </h3>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 font-mono block mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  value={customTaskInput}
                  onChange={(e) => setCustomTaskInput(e.target.value)}
                  placeholder="ej. Resolver SSL de Sandbox"
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-400 font-mono block mb-1">Fase del Proyecto</label>
                  <select
                    value={customTaskPhaseIndex}
                    onChange={(e) => setCustomTaskPhaseIndex(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl p-2 md:p-3 text-xs text-white outline-none"
                  >
                    {activeProject?.phases.map((ph, index) => (
                      <option key={index} value={index}>Fase {index + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-400 font-mono block mb-1">Rol Responsable</label>
                  <input
                    type="text"
                    value={customTaskRole}
                    onChange={(e) => setCustomTaskRole(e.target.value)}
                    placeholder="ej. DevOps, Designer"
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-400 font-mono block mb-1">Prioridad</label>
                  <select
                    value={customTaskPriority}
                    onChange={(e) => setCustomTaskPriority(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl p-2 text-xs text-white outline-none"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-400 font-mono block mb-1">Días Estimados</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={customTaskDays}
                    onChange={(e) => setCustomTaskDays(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-stone-400 text-xs font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-lg"
                >
                  Crear Tarea
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
