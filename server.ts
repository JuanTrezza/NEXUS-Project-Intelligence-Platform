import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please add it to your secrets or environment.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST Endpoints
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Project Generation Endpoint using Gemini API
app.post("/api/project/generate", async (req: Request, res: Response) => {
  try {
    const { name, description, category, size } = req.body;

    if (!name) {
       res.status(400).json({ error: "El nombre del proyecto es obligatorio." });
       return;
    }

    const ai = getAI();

    const prompt = `Analiza y planifica el siguiente proyecto en español como si fueras Nexus AI, la inteligencia artificial predictiva avanzada de gestión de proyectos. Evaluando su complejidad, emite un reporte predictivo detallado de riesgos, fases y tareas secuenciales.
    
    Información del proyecto:
    - Nombre: "${name}"
    - Descripción/Objetivos: "${description || 'Lanzamiento y configuración estándar.'}"
    - Categoría: "${category || 'General'}"
    - Tamaño estimado: "${size || 'Medio'}"
    
    Genera un plan de proyecto realista y dinámico en formato JSON estructurado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres Nexus AI, un planificador de proyectos hiper-preciso en español. Predices de forma realista la probabilidad de retrasos antes de que comience el proyecto e identificas dependencias complicadas. Siempre respondes con estructura JSON pura y válida.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["projectName", "predictedDelayRisk", "delayRiskLevel", "riskExplanation", "estimatedWeeks", "phases", "aiRecommendations"],
          properties: {
            projectName: {
              type: Type.STRING,
              description: "Nombre del proyecto saneado."
            },
            predictedDelayRisk: {
              type: Type.INTEGER,
              description: "Porcentaje exacto de riesgo de retraso proyectado por la IA (de 0 a 100)."
            },
            delayRiskLevel: {
              type: Type.STRING,
              description: "Nivel cualitativo de riesgo: 'Bajo', 'Medio', o 'Alto'."
            },
            riskExplanation: {
              type: Type.STRING,
              description: "Explicación detallada de por qué existe ese porcentaje de riesgo, los cuellos de botella clave analizados y la mitigación predictiva."
            },
            estimatedWeeks: {
              type: Type.NUMBER,
              description: "Duración estimada en semanas para todo el proyecto."
            },
            phases: {
              type: Type.ARRAY,
              description: "Las fases secuenciales del proyecto.",
              items: {
                type: Type.OBJECT,
                required: ["phaseName", "tasks"],
                properties: {
                  phaseName: {
                    type: Type.STRING,
                    description: "Título de la fase, ejemplo: 'Fase 1: Definición y Mockups'."
                  },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "title", "description", "estimatedDays", "role", "priority"],
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedDays: { type: Type.INTEGER },
                        role: { 
                          type: Type.STRING,
                          description: "Persona sugerida: 'Diseñador', 'Desarrollador Backend', 'Desarrollador Frontend', 'DevOps', 'Product Manager', 'QA'." 
                        },
                        priority: { 
                          type: Type.STRING,
                          description: "Prioridad de la tarea: 'Alta', 'Media', 'Baja'." 
                        }
                      }
                    }
                  }
                }
              }
            },
            aiRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recomendaciones específicas e inteligentes que da la IA para recortar tiempos y evitar los cuellos de botella sugeridos."
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No se recibió respuesta válida del planificador Nexus AI.");
    }

    const projectData = JSON.parse(textOutput.trim());
    res.json(projectData);
  } catch (error: any) {
    console.error("Error al generar proyecto con AI:", error);
    res.status(500).json({ 
      error: "Error interno del servidor al procesar con Nexus AI.", 
      message: error.message || String(error)
    });
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nexus Server] Escuchando en http://localhost:${PORT}`);
  });
}

startServer();
