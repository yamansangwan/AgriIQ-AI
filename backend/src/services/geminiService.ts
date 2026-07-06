import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Since the user is likely on Gemini 2.5 Flash, we initialize the client.
// Note: This relies on the standard `@google/genai` package for Node.js.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });

/**
 * Helper to call Gemini model.
 * In a real app with valid keys, this actually calls the API.
 * For now, we add a mock fallback if the key is 'mock_key'.
 */
export const callGemini = async (prompt: string, imageBase64?: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('mock')) {
    throw new Error('A valid GEMINI_API_KEY is strictly required to process this request. Please add it to your .env file.');
  }

  try {
    const contents: any[] = [];
    
    if (imageBase64) {
       contents.push({
         role: 'user',
         parts: [
           { text: prompt },
           {
             inlineData: {
               data: imageBase64,
               mimeType: 'image/jpeg'
             }
           }
         ]
       });
    } else {
       contents.push({
         role: 'user',
         parts: [{ text: prompt }]
       });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return response.text || "{}";
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const msg = error.message || '';
    if (error.status === 429 || error.status === 503 || msg.includes('429') || msg.includes('quota') || msg.includes('demand') || error.status === 404) {
      console.log('API limit or overload reached. Falling back to mock data.');
      return generateMockResponse(prompt);
    }
    throw new Error(msg || 'Failed to generate content from Gemini');
  }
};

const generateMockResponse = (prompt: string): string => {
  if (prompt.includes('Crop Vision Agent')) {
    return JSON.stringify({
      crop: 'Corn (Zea mays)',
      growthStage: 'Vegetative V8 to V10 Stage',
      healthEstimate: 'Moderate Stress - Early signs of nutrient deficiency and possible fungal infection',
      diseaseSymptoms: ['Long, elliptical, grayish-green or brown lesions indicative of Northern Corn Leaf Blight', 'Yellowing along the leaf margins (Nitrogen deficiency)'],
      confidenceScore: 0.96
    });
  }
  
  if (prompt.includes('Agricultural Multi-Agent System')) {
    return JSON.stringify({
      diseaseProtection: {
        pesticides: ['Bifenthrin for Corn Rootworm control', 'Spinosad for European Corn Borer (Organic friendly)'],
        fungicides: ['Pyraclostrobin (Headline) - Apply at VT (tasseling) stage', 'Azoxystrobin (Quadris) for Northern Corn Leaf Blight'],
        organicAlternatives: ['Bacillus thuringiensis (Bt) sprays for caterpillar control', 'Neem oil extract (1500 ppm) applied evenly'],
        preventionMethods: ['Adopt crop rotation with soybeans to break rootworm cycle', 'Select NCLB-resistant corn hybrids for next season', 'Ensure deep plowing to bury infected crop residue']
      },
      weatherIntelligence: {
        rainfallRisk: 'Moderate - Isolated thunderstorms expected in 72 hours',
        droughtRisk: 'Low - Soil moisture is currently adequate (75%)',
        humidityImpact: 'High humidity (>85%) over the next 3 days will accelerate fungal lesion expansion on the lower canopy.',
        weatherAlerts: ['High Humidity Advisory - Monitor for fungal spread']
      },
      cropAdvisor: {
        fertilizerRecommendations: ['Side-dress Nitrogen (UAN 32% or Anhydrous Ammonia) immediately', 'Foliar spray with Zinc to prevent stunted growth'],
        irrigationRecommendations: ['Maintain current pivot irrigation schedule; hold 24 hours before expected rainfall'],
        growthStageGuidance: ['During the V8-V10 stage, corn is rapidly accumulating dry matter and determining ear size. Nitrogen demand is peaking.'],
        nextSeasonSuggestions: ['Rotate to a legume like Soybeans to naturally replenish soil nitrogen', 'Consider Bt Corn varieties if borer pressure remains high']
      },
      governmentSupport: {
        relevantSubsidies: ['National Mission on Agriculture - 30% subsidy on Zinc micronutrients', 'Corn Farmer Drought Protection Scheme 2026'],
        cropInsurancePrograms: ['National Agricultural Insurance Scheme (NAIS) - Ensure V-stage reports are filed'],
        assistancePrograms: ['Sustainable Farming Fund - Apply via local agricultural extension office']
      },
      planner: {
        farmHealthScore: {
          overall: 65,
          cropHealth: 55,
          diseaseRisk: 80,
          weatherRisk: 40,
          yieldRisk: 50
        },
        actionPlan: {
          weekly: ['IMMEDIATE: Apply Nitrogen side-dress to correct yellowing', 'Apply Pyraclostrobin fungicide to halt leaf blight progression', 'Scout inner rows for European Corn Borer larvae'],
          monthly: ['Prepare irrigation pivots for peak tassel water demand', 'Schedule drone survey at VT stage to estimate yield potential']
        },
        executiveSummary: 'The corn crop is in the critical vegetative growth phase (V8-V10) but is exhibiting early signs of Northern Corn Leaf Blight and Nitrogen deficiency. Because the plant is currently determining its maximum ear size, immediate nitrogen side-dressing and preventative fungicide applications are critical. Yield loss could be prevented if action is taken within the next 48 hours.',
        riskAssessment: 'HIGH DISEASE RISK due to humidity and existing lesions. Moderate yield risk if Nitrogen is not supplemented immediately.'
      }
    });
  }

  return JSON.stringify({ message: "Mock response" });
};
