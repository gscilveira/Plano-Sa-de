import { GoogleGenAI, Type } from "@google/genai";
import { HealthPlan, UserData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateHealthPlan(data: UserData): Promise<HealthPlan> {
  const prompt = `
    Gere um plano de saúde personalizado em Português para um usuário com:
    Idade: ${data.age}, Peso: ${data.weight}kg, Altura: ${data.height}cm, Objetivo: ${data.objective}, Gênero: ${data.gender}.

    Analise e retorne:
    1. Biotipo provável (Ectomorfo, Mesomorfo ou Endomorfo) e uma descrição curta de suas características.
    2. IMC (Índice de Massa Corporal).
    3. TMB (Taxa Metabólica Basal) e TDEE (Gasto Energético Diário Total).
    4. Calorias diárias recomendadas para o objetivo.
    5. Meta de água diária (ml).
    6. Macros detalhados (Proteína, Carboidrato, Gordura).
    7. 4 Refeições diárias.
    8. Um plano de treino semanal de 7 dias (Segunda a Domingo), especificando o foco de cada dia. Para cada dia de treino ativo, inclua obrigatoriamente pelo menos 6 exercícios detalhados (ex: se o dia for Peito e Tríceps, inclua 3 ou 4 de peito e 3 ou 4 de tríceps).
    9. 3 recomendações de Bio-hacking.

    Retorne rigorosamente no formato JSON especificado.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          biotype: { type: Type.STRING },
          biotypeDescription: { type: Type.STRING },
          imc: { type: Type.NUMBER },
          tmb: { type: Type.NUMBER },
          tdee: { type: Type.NUMBER },
          dailyCalories: { type: Type.NUMBER },
          waterTarget: { type: Type.NUMBER },
          macros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                color: { type: Type.STRING }
              },
              required: ["name", "value", "unit", "color"]
            }
          },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                name: { type: Type.STRING },
                foods: { type: Type.ARRAY, items: { type: Type.STRING } },
                calories: { type: Type.NUMBER }
              },
              required: ["time", "name", "foods", "calories"]
            }
          },
          weeklyWorkout: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.STRING },
                      reps: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ["name", "sets", "reps"]
                  }
                }
              },
              required: ["day", "focus", "exercises"]
            }
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["biotype", "biotypeDescription", "imc", "tmb", "tdee", "dailyCalories", "waterTarget", "macros", "meals", "weeklyWorkout", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as HealthPlan;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Falha ao gerar seu plano personalizado. Tente novamente.");
  }
}
