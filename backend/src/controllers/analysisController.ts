import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { imagekit } from '../middlewares/upload';
import AnalysisReport from '../models/AnalysisReport';
import { runAgentWorkflow } from '../services/agents';

// In-memory cache for development without MongoDB
const reportCache = new Map<string, any>();

export const analyzeCrop = async (req: Request, res: Response) => {
  try {
    const { location, problemDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let imageUrl = '';
    const localFileName = `agripilot-${Date.now()}-${file.originalname}`;
    cconst uploadDir = path.join(__dirname, '../../uploads');
    const localFilePath = path.join(uploadDir, localFileName);
    
    // Save to local disk for local serving fallback
    try {
      
        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      await fs.promises.writeFile(localFilePath, file.buffer);
      imageUrl = `http://localhost:5000/uploads/${localFileName}`;
    } catch (e) {
      console.error('Failed to write local file', e);
      imageUrl = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?q=80&w=1000&auto=format&fit=crop';
    }

    // 1. Upload to ImageKit (only if not using mock keys)
    if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PUBLIC_KEY !== 'mock_ik_public') {
      try {
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: localFileName,
          folder: '/agripilot'
        });
        imageUrl = uploadResponse.url;
      } catch (err: any) {
        console.error('ImageKit upload failed explicitly:', err.message || err);
    } else {
      console.warn('ImageKit keys missing, skipping ImageKit upload.');
    }

    // 2. Convert buffer to base64 for Gemini
    const imageBase64 = file.buffer.toString('base64');

    // 3. Run Agents Workflow
    const results = await runAgentWorkflow(imageBase64, location || 'Unknown', problemDescription || 'None provided');

    // 4. Save to Database (or mock if DB fails)
    const reportData = {
      imageUrl: imageUrl,
      location,
      problemDescription,
      farmHealthScore: results.planner?.farmHealthScore || {},
      cropVision: results.cropVision,
      diseaseProtection: results.diseaseProtection,
      weatherIntelligence: results.weatherIntelligence,
      cropAdvisor: results.cropAdvisor,
      governmentSupport: results.governmentSupport,
      actionPlan: results.planner?.actionPlan || {},
      executiveSummary: results.planner?.executiveSummary || results.planner?.riskAssessment || "No summary"
    };

    let report;
    try {
      report = new AnalysisReport(reportData);
      await report.save();
    } catch (dbError) {
      console.warn('Database save failed, using in-memory cache');
      const mockId = `local_id_${Date.now()}`;
      report = { ...reportData, _id: mockId };
      reportCache.set(mockId, report);
    }

    res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    console.error('Analysis Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      return res.status(429).json({ error: 'Google Gemini Free-Tier Rate Limit Exceeded. Please wait 1 minute before trying again.' });
    }
    res.status(500).json({ error: 'Server error during analysis' });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Check in-memory cache first
    if (reportCache.has(id)) {
      return res.status(200).json({ success: true, data: reportCache.get(id) });
    }

    // Otherwise check MongoDB if available
    let report = null;
    try {
      report = await AnalysisReport.findById(id);
    } catch (dbError) {
      // Ignore DB connection errors
    }
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching report' });
  }
};

export const simulateScenario = async (req: Request, res: Response) => {
  try {
    const { reportId, scenario } = req.body;
    
    // Check cache
    let report = reportCache.get(reportId);
    
    // If not in cache, check DB
    if (!report) {
      try {
        report = await AnalysisReport.findById(reportId);
      } catch (e) {
        // Ignore DB error
      }
    }

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // For a scenario, we skip image upload/vision and just rerun the text agents based on the new scenario
    // We would fetch the image from ImageKit to pass to Gemini again, or just use the old vision output.
    // However, since we need a valid base64 image for the vision agent to not crash, we should skip vision.
    // But since `runAgentWorkflow` runs everything, we need to provide a dummy valid 1x1 pixel base64 image.
    
    const validDummyBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const combinedProblem = `Original problem: ${report.problemDescription}. What if: ${scenario}`;
    
    const results = await runAgentWorkflow(validDummyBase64Image, report.location || 'Unknown', combinedProblem);

    // Save as a new simulated report or just return to user
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Simulation Error:', error);
    res.status(500).json({ error: 'Server error during simulation' });
  }
};
