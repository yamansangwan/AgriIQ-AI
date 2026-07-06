"use client";

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { getReport, simulateScenario } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RefreshCw, Send, ShieldCheck, CloudRain, Leaf, BookOpen, Building } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await getReport(unwrappedParams.id);
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario) return;
    setIsSimulating(true);
    try {
      const res = await simulateScenario(unwrappedParams.id, scenario);
      if (res.success) {
        // Just overriding local state with simulation data
        setReport({ ...report, ...res.data.planner, ...res.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
      setScenario('');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  if (!report) return <div className="text-center mt-20">Report not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-black pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-emerald-100/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-500 hover:text-emerald-600 transition-colors p-2 hover:bg-emerald-50 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#105921] drop-shadow-sm" style={{ fontFamily: 'var(--font-outfit)' }}>AgriIQ Report</h1>
          </div>
          <div className="text-sm font-medium text-emerald-800 bg-emerald-100/50 px-4 py-1.5 rounded-full border border-emerald-200/50">
            {report.location ? `Location: ${report.location}` : 'Location: Unknown'}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Summary & Scores */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-[2rem] border border-emerald-100/50 shadow-xl shadow-emerald-900/5 overflow-hidden bg-white/80 backdrop-blur-xl">
            <div className="h-64 w-full bg-emerald-50 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.imageUrl} alt="Crop" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <CardContent className="p-8">
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900 drop-shadow-sm" style={{ fontFamily: 'var(--font-outfit)' }}>Executive Summary</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                {report.executiveSummary}
              </p>
              
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-emerald-100 pb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Farm Health Score</h3>
                <ScoreBar label="Overall Score" score={report.farmHealthScore?.overall || 0} color="bg-emerald-600" />
                <ScoreBar label="Crop Health" score={report.farmHealthScore?.cropHealth || 0} color="bg-green-500" />
                <ScoreBar label="Disease Risk" score={report.farmHealthScore?.diseaseRisk || 0} color="bg-red-500" inverse />
                <ScoreBar label="Weather Risk" score={report.farmHealthScore?.weatherRisk || 0} color="bg-blue-500" inverse />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-emerald-100/50 shadow-xl shadow-emerald-900/5 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>Scenario Simulator</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSimulate} className="flex flex-col space-y-4">
                <Input 
                  placeholder="e.g. What if rainfall drops 20%?" 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="rounded-2xl border-emerald-200 bg-emerald-50/30 focus:bg-white focus:ring-emerald-500 focus:border-emerald-500 h-14 px-4 text-base shadow-sm"
                />
                <Button disabled={isSimulating} type="submit" className="w-full h-14 rounded-2xl bg-black text-white hover:bg-white hover:text-black shadow-lg hover:shadow-black/20 transition-all text-base font-bold border-2 border-transparent hover:border-black">
                  {isSimulating ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  Simulate Impact
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Multi-Agent Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2rem] border border-black shadow-2xl shadow-black/20 bg-white/80 backdrop-blur-xl h-full">
            <CardHeader className="border-b border-black/10 pb-6 pt-8 px-8 bg-gradient-to-b from-emerald-50/30 to-transparent">
              <CardTitle className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>Multi-Agent Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="actionPlan" className="w-full">
                <div className="px-8 pt-6">
                  <TabsList className="w-full justify-start overflow-x-auto bg-emerald-50/50 rounded-2xl p-1.5 h-[3.5rem] border border-emerald-100/50 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsTrigger value="actionPlan" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">Action Plan</TabsTrigger>
                    <TabsTrigger value="vision" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"><Leaf className="w-4 h-4 mr-2"/> Vision</TabsTrigger>
                    <TabsTrigger value="disease" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"><ShieldCheck className="w-4 h-4 mr-2"/> Disease</TabsTrigger>
                    <TabsTrigger value="weather" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"><CloudRain className="w-4 h-4 mr-2"/> Weather</TabsTrigger>
                    <TabsTrigger value="advisor" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"><BookOpen className="w-4 h-4 mr-2"/> Advisor</TabsTrigger>
                    <TabsTrigger value="govt" className="rounded-xl px-6 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"><Building className="w-4 h-4 mr-2"/> Govt</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="actionPlan" className="mt-0 outline-none">
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center" style={{ fontFamily: 'var(--font-outfit)' }}>
                          <span className="w-3 h-3 rounded-full bg-red-500 mr-3 shadow-lg shadow-red-500/50"></span> Weekly Priorities
                        </h4>
                        <ul className="space-y-3">
                          {report.actionPlan?.weekly?.map((item: string, i: number) => (
                            <li key={i} className="flex p-5 bg-red-50/80 rounded-2xl text-base border border-red-100/50 text-red-900 font-medium shadow-sm hover:shadow-md transition-shadow">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center" style={{ fontFamily: 'var(--font-outfit)' }}>
                          <span className="w-3 h-3 rounded-full bg-blue-500 mr-3 shadow-lg shadow-blue-500/50"></span> Monthly Strategy
                        </h4>
                        <ul className="space-y-3">
                          {report.actionPlan?.monthly?.map((item: string, i: number) => (
                            <li key={i} className="flex p-5 bg-blue-50/80 rounded-2xl text-base border border-blue-100/50 text-blue-900 font-medium shadow-sm hover:shadow-md transition-shadow">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vision" className="mt-0 outline-none"><DataList data={report.cropVision} /></TabsContent>
                  <TabsContent value="disease" className="mt-0 outline-none"><DataList data={report.diseaseProtection} /></TabsContent>
                  <TabsContent value="weather" className="mt-0 outline-none"><DataList data={report.weatherIntelligence} /></TabsContent>
                  <TabsContent value="advisor" className="mt-0 outline-none"><DataList data={report.cropAdvisor} /></TabsContent>
                  <TabsContent value="govt" className="mt-0 outline-none"><DataList data={report.governmentSupport} /></TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}

function ScoreBar({ label, score, color, inverse = false }: { label: string, score: number, color: string, inverse?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2 text-gray-800">
        <span>{label}</span>
        <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100 font-extrabold">{score}/100</span>
      </div>
      <Progress value={score} className="h-3 bg-gray-100 overflow-hidden" indicatorClassName={color} />
    </div>
  );
}

// A simple recursive component to render JSON objects neatly
function DataList({ data }: { data: any }) {
  if (!data) return <p className="text-gray-500 italic text-base p-6 text-center border-2 border-dashed border-gray-200 rounded-3xl">No data available.</p>;

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value], idx) => (
        <div key={idx} className="bg-white border border-black rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
          <h4 className="text-sm font-extrabold text-emerald-600/70 uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>{key.replace(/([A-Z])/g, ' $1')}</h4>
          {Array.isArray(value) ? (
            <ul className="space-y-3">
              {value.map((v, i) => (
                <li key={i} className="flex items-start">
                   <div className="min-w-2 mt-2 mr-3 h-2 rounded-full bg-emerald-400"></div>
                   <span className="text-base text-gray-800 leading-relaxed font-medium">{v}</span>
                </li>
              ))}
            </ul>
          ) : typeof value === 'object' ? (
            <pre className="text-sm bg-emerald-50/50 border border-emerald-100/50 p-5 rounded-2xl overflow-x-auto text-emerald-900 shadow-inner">{JSON.stringify(value, null, 2)}</pre>
          ) : (
            <p className="text-lg font-bold text-gray-900 leading-relaxed">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
