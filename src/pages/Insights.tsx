
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionInsights from '@/components/QuestionInsights';

const InsightsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="bg-muted/30 py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Data Insights
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                Make Better Decisions with African Data
              </h1>
              <p className="text-foreground/70 mb-4">
                Ask questions and get data-driven insights across economic, social, 
                and environmental topics relevant to African development
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <QuestionInsights />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InsightsPage;
