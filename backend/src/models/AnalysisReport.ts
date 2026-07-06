import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysisReport extends Document {
  imageUrl: string;
  location?: string;
  problemDescription?: string;
  farmHealthScore: {
    overall: number;
    cropHealth: number;
    diseaseRisk: number;
    weatherRisk: number;
    yieldRisk: number;
  };
  cropVision: any;
  diseaseProtection: any;
  weatherIntelligence: any;
  cropAdvisor: any;
  governmentSupport: any;
  actionPlan: {
    weekly: any[];
    monthly: any[];
  };
  executiveSummary: string;
  createdAt: Date;
}

const AnalysisReportSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  location: { type: String },
  problemDescription: { type: String },
  farmHealthScore: {
    overall: { type: Number, required: true },
    cropHealth: { type: Number, required: true },
    diseaseRisk: { type: Number, required: true },
    weatherRisk: { type: Number, required: true },
    yieldRisk: { type: Number, required: true },
  },
  cropVision: { type: Schema.Types.Mixed },
  diseaseProtection: { type: Schema.Types.Mixed },
  weatherIntelligence: { type: Schema.Types.Mixed },
  cropAdvisor: { type: Schema.Types.Mixed },
  governmentSupport: { type: Schema.Types.Mixed },
  actionPlan: {
    weekly: [{ type: Schema.Types.Mixed }],
    monthly: [{ type: Schema.Types.Mixed }],
  },
  executiveSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalysisReport>('AnalysisReport', AnalysisReportSchema);
