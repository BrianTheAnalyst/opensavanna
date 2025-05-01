
import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, ArrowRight, Map, BarChart2, PanelRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import KnowledgeGraph from './KnowledgeGraph';
import { getEntities } from '@/services/entityService';
import { Entity } from '@/types/entity';
import { Badge } from "@/components/ui/badge";

interface QuestionInsightsProps {
  className?: string;
}

const QuestionInsights: React.FC<QuestionInsightsProps> = ({ className }) => {
  const [question, setQuestion] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [relatedEntities, setRelatedEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [relatedDatasets, setRelatedDatasets] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Example questions
  const exampleQuestions = [
    'What is the cost of electricity in East Africa?',
    'How does rainfall affect crop yields in West Africa?',
    'What is the education enrollment rate in Nigeria?',
    'How has COVID-19 impacted tourism in Africa?',
    'What are renewable energy trends across North Africa?'
  ];

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle question submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setIsSearching(true);
    setShowResults(false);

    try {
      // Search for related entities
      const search = question.toLowerCase();
      let keywords: string[] = [];
      
      // Extract potential topics from the question
      if (search.includes('electricity') || search.includes('energy')) {
        keywords.push('electricity', 'energy');
      }
      if (search.includes('education')) {
        keywords.push('education', 'school');
      }
      if (search.includes('health') || search.includes('healthcare')) {
        keywords.push('health', 'healthcare');
      }
      if (search.includes('agriculture') || search.includes('farming')) {
        keywords.push('agriculture', 'farm', 'crops');
      }
      
      // If no specific keywords detected, extract potential words
      if (keywords.length === 0) {
        // Get potential keywords - words with 4+ characters
        keywords = question
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(' ')
          .filter(word => word.length > 4);
      }
      
      // Construct search query
      const searchTerm = keywords.join(' ');
      const entities = await getEntities(undefined, searchTerm);
      setRelatedEntities(entities);
      
      // If we have related entities, select the first one
      if (entities.length > 0) {
        setSelectedEntity(entities[0]);
        
        // Mock related datasets (in a real app, this would be from the database)
        setRelatedDatasets([
          {
            id: 'dataset-1',
            title: `${entities[0].type === 'Topic' ? entities[0].name : ''} Statistics in Africa`,
            description: `Comprehensive data about ${entities[0].name.toLowerCase()} trends across African countries`,
            format: 'CSV',
            category: entities[0].type === 'Topic' ? entities[0].name : 'Economics'
          },
          {
            id: 'dataset-2',
            title: `${entities[0].name} Regional Analysis`,
            description: `Regional breakdown of ${entities[0].name.toLowerCase()} patterns in Sub-Saharan Africa`,
            format: 'JSON',
            category: 'Geography'
          }
        ]);
        
        // Generate sample insights based on the question
        generateSampleInsights(question, entities[0]);
      } else {
        // No entities found
        setSelectedEntity(null);
        setRelatedDatasets([]);
        setInsights([
          "We don't have enough data to answer this question yet.",
          "You can contribute relevant datasets to help build knowledge in this area."
        ]);
      }
      
      // Show results
      setShowResults(true);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Failed to search for insights');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Sample insights based on question
  const generateSampleInsights = (question: string, entity: Entity) => {
    const q = question.toLowerCase();
    let insights: string[] = [];
    
    if (q.includes('electricity') || q.includes('energy')) {
      insights = [
        "Electricity prices across East Africa vary significantly, with Kenya having the highest average cost at $0.15-0.22 per kWh for residential use.",
        "Tanzania and Uganda have implemented residential tariff reforms, reducing costs by 12% and 8% respectively since 2020.",
        "Rural electrification rates in East Africa average 34%, compared to 76% in urban areas.",
        "Renewable energy sources account for approximately 41% of East Africa's electricity generation capacity."
      ];
    } else if (q.includes('education')) {
      insights = [
        "Primary school enrollment rates in West Africa have increased by 24% over the last decade.",
        "Nigeria has a 65% secondary school completion rate, with significant urban-rural disparities.",
        "Girls' education enrollment has improved by 18% across Africa since 2015, though gender gaps persist in rural areas.",
        "Teacher-to-student ratios average 1:43 in public schools across the surveyed African nations."
      ];
    } else if (q.includes('health') || q.includes('healthcare')) {
      insights = [
        "Healthcare spending per capita varies widely across Africa, from $15 to $650 annually.",
        "Medical professional density averages 2.3 physicians per 10,000 people across the continent.",
        "Urban residents have approximately 3.2x better access to healthcare facilities than rural populations.",
        "Preventable diseases account for 62% of the healthcare burden in Sub-Saharan Africa."
      ];
    } else if (q.includes('agriculture') || q.includes('farming')) {
      insights = [
        "Small-scale farming provides livelihoods for 65% of Africa's working population.",
        "Climate change has reduced crop yields by an estimated 13% across rain-fed agricultural systems.",
        "Modern farming techniques have been adopted by only 23% of African farmers, presenting significant growth opportunity.",
        "Agricultural exports represent 16% of total export value for the average African nation."
      ];
    } else {
      insights = [
        `Data shows significant variations in ${entity.name.toLowerCase()} across different African regions.`,
        `${entity.name} trends have shown consistent growth in urban areas, while rural development lags by 35%.`,
        `Recent developments in ${entity.name.toLowerCase()} policies have resulted in measurable improvements in 7 out of 10 African nations studied.`,
        `The relationship between ${entity.name.toLowerCase()} and economic outcomes is strongest in countries with diversified economies.`
      ];
    }
    
    setInsights(insights);
  };
  
  // Use an example question
  const useExampleQuestion = (q: string) => {
    setQuestion(q);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  return (
    <div className={className}>
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Ask a Question</h2>
        <p className="text-foreground/70 mb-6">
          Get insights on economic, social, and environmental data across Africa
        </p>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
              <Input
                ref={inputRef}
                placeholder="What would you like to know about African data?"
                className="pl-10 pr-4"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={!question.trim() || isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </form>
        
        <div className="space-y-2">
          <p className="text-xs text-foreground/50">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => useExampleQuestion(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      {showResults && (
        <div className="mt-8 space-y-8">
          {/* Insights Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Data Insights
            </h3>
            
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-foreground/80">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No insights available for this query.</p>
            )}
            
            {relatedDatasets.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Supporting Data Sources</h4>
                <div className="space-y-3">
                  {relatedDatasets.map((dataset, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{dataset.title}</p>
                        <p className="text-sm text-foreground/70">{dataset.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* Knowledge Graph Section */}
          {selectedEntity && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  Related Knowledge
                </h3>
                <Badge variant="outline" className="font-normal">
                  <span className="h-2 w-2 rounded-full bg-primary mr-1.5"></span>
                  {selectedEntity.type}
                </Badge>
              </div>
              
              <KnowledgeGraph rootEntity={selectedEntity} depth={1} />
            </div>
          )}
          
          {/* Related Entities */}
          {relatedEntities.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <PanelRight className="h-5 w-5 mr-2 text-primary" />
                Related Topics
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {relatedEntities.map((entity) => (
                  <Badge 
                    key={entity.id} 
                    variant={selectedEntity?.id === entity.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEntity(entity);
                      
                      // Update sample insights based on new entity
                      generateSampleInsights(question, entity);
                    }}
                  >
                    {entity.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionInsights;
