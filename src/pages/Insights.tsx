
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionInsights from '@/components/QuestionInsights';
import { Brain, PanelRight, BarChart3, Database } from 'lucide-react';

const InsightsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="bg-muted/30 py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                AI-Powered Data Insights
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                Ask Questions, Get Intelligent Answers
              </h1>
              <p className="text-foreground/70 mb-8">
                Our advanced AI analyzes thousands of African datasets to deliver data-driven 
                insights across economic, social, environmental, and infrastructure domains
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-background/70 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center">
                  <Brain className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-sm font-medium mb-1">Advanced Analytics</h3>
                  <p className="text-xs text-muted-foreground">Complex data processing provides deep insights beyond basic statistics</p>
                </div>
                
                <div className="bg-background/70 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center">
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-sm font-medium mb-1">Trend Detection</h3>
                  <p className="text-xs text-muted-foreground">Identifies patterns and correlations across disparate datasets</p>
                </div>
                
                <div className="bg-background/70 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center">
                  <PanelRight className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-sm font-medium mb-1">Knowledge Graph</h3>
                  <p className="text-xs text-muted-foreground">Connects related concepts to provide contextual understanding</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <QuestionInsights />
              
              <div className="mt-16 pt-12 border-t border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">How Our AI Works</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h3 className="text-base font-medium mb-3">Deep Data Processing</h3>
                    <p className="text-sm text-foreground/70">
                      Our AI system processes uploaded datasets to extract meaningful patterns, anomalies, and insights.
                      It identifies correlations between different data points and generates advanced analytics that
                      would typically require extensive manual analysis.
                    </p>
                  </div>
                  
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h3 className="text-base font-medium mb-3">Cross-Dataset Analysis</h3>
                    <p className="text-sm text-foreground/70">
                      When you ask a question, our AI doesn't just look at a single dataset - it analyzes information
                      across multiple relevant datasets to provide comprehensive answers with supporting evidence from
                      various sources.
                    </p>
                  </div>
                  
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h3 className="text-base font-medium mb-3">Natural Language Understanding</h3>
                    <p className="text-sm text-foreground/70">
                      Ask questions in plain language, and our AI interprets your intent, identifies relevant datasets,
                      and formulates answers that address your specific inquiry - whether you're asking about trends,
                      comparisons, relationships, or causal factors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InsightsPage;
