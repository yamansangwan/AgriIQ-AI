import { callGemini } from '../geminiService';

export const runAgentWorkflow = async (imageBase64: string, location: string, problemDescription: string) => {
  const prompt = `
    You are an expert Agricultural Multi-Agent System (comprising Crop Vision, Disease, Weather, Crop Advisor, Government, and Farm Planner agents).
    Analyze the provided image of a crop.
    Context: Location: ${location}, Problem Description: ${problemDescription}.
    
    CRITICAL INSTRUCTION: You MUST cross-reference the user's location (${location}) and ONLY recommend items legally available and practically used in that region.
    
    Respond in raw JSON format with exactly the following structure (do not wrap in markdown):
    {
      "cropVision": {
        "crop": "...", "growthStage": "...", "healthEstimate": "...", "diseaseSymptoms": ["..."], "confidenceScore": 0.95
      },
      "diseaseProtection": {
        "pesticides": ["..."], "fungicides": ["..."], "organicAlternatives": ["..."], "preventionMethods": ["..."]
      },
      "weatherIntelligence": {
        "rainfallRisk": "...", "droughtRisk": "...", "humidityImpact": "...", "weatherAlerts": ["..."]
      },
      "cropAdvisor": {
        "fertilizerRecommendations": ["..."], "irrigationRecommendations": ["..."], "growthStageGuidance": ["..."], "nextSeasonSuggestions": ["..."]
      },
      "governmentSupport": {
        "relevantSubsidies": ["..."], "cropInsurancePrograms": ["..."], "assistancePrograms": ["..."]
      },
      "planner": {
        "farmHealthScore": { "overall": 80, "cropHealth": 75, "diseaseRisk": 20, "weatherRisk": 10, "yieldRisk": 15 },
        "actionPlan": { "weekly": ["..."], "monthly": ["..."] },
        "executiveSummary": "...",
        "riskAssessment": "..."
      }
    }
  `;

  const resultStr = await callGemini(prompt, imageBase64);
  
  let data;
  try {
    data = JSON.parse(resultStr);
  } catch (e) {
    console.error('Failed to parse single-pass agent response', e);
    data = { error: 'Failed to parse', raw: resultStr };
  }

  return {
    cropVision: data.cropVision || {},
    diseaseProtection: data.diseaseProtection || {},
    weatherIntelligence: data.weatherIntelligence || {},
    cropAdvisor: data.cropAdvisor || {},
    governmentSupport: data.governmentSupport || {},
    planner: data.planner || {}
  };
};
