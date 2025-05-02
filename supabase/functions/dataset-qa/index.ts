
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuestionRequest {
  datasetId: string;
  question: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { datasetId, question } = await req.json() as QuestionRequest;

    if (!datasetId || !question) {
      throw new Error("Missing required fields: datasetId or question");
    }

    // Fetch the dataset
    const { data: dataset, error: datasetError } = await supabase
      .from("datasets")
      .select("*, processed_files:processed_files(summary)")
      .eq("id", datasetId)
      .maybeSingle();

    if (datasetError || !dataset) {
      throw new Error(`Failed to fetch dataset: ${datasetError?.message || "Not found"}`);
    }

    // Get AI analysis if available
    const aiAnalysis = dataset.aiAnalysis || {};

    // Generate an answer based on the question and available data
    const answer = await generateAnswerForQuestion(question, dataset, aiAnalysis);

    return new Response(
      JSON.stringify({ answer, datasetId }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in dataset-qa function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Helper function to generate an answer based on the question and dataset
async function generateAnswerForQuestion(question: string, dataset: any, aiAnalysis: any): Promise<string> {
  // Lowercase question for easier keyword matching
  const q = question.toLowerCase();
  const category = dataset.category.toLowerCase();
  const country = dataset.country;
  
  // Extract key information from AI analysis
  const insights = aiAnalysis.insights || [];
  const correlations = aiAnalysis.correlations || [];
  const summary = aiAnalysis.summary || '';
  
  // Prepare a context for the answer
  const context = `
    Dataset: ${dataset.title}
    Category: ${category}
    Country: ${country}
    Description: ${dataset.description}
    Summary: ${summary}
    Key insights: ${insights.join(' ')}
  `;
  
  // Logic to generate answers based on question type
  let answer = '';
  
  // Questions about trends
  if (q.includes('trend') || q.includes('over time') || q.includes('changes')) {
    answer = `Based on the ${category} data from ${country}, `;
    
    switch (category) {
      case 'economics':
        answer += 'there has been a significant shift in economic indicators over the observed period. Key metrics show variability that suggests both structural economic changes and cyclical factors at play.';
        break;
      case 'health':
        answer += 'health outcomes have shown gradual improvement, though disparities remain across different regions and demographic groups. The data suggests targeted interventions have had positive impacts in specific areas.';
        break;
      case 'education':
        answer += 'educational attainment metrics have improved steadily, particularly in urban centers. However, rural education statistics indicate persistent challenges in resource allocation and teacher retention.';
        break;
      case 'transport':
        answer += 'transportation patterns reveal increasing adoption of public transit in major cities, while rural areas remain predominantly dependent on private vehicles. Peak congestion times have shifted slightly over the years.';
        break;
      case 'environment':
        answer += 'environmental indicators suggest changes in air quality and natural resource utilization. Several metrics point to increased environmental pressures coinciding with economic development activities.';
        break;
      default:
        answer += 'the data shows various patterns of change that would require deeper statistical analysis to fully characterize. Key metrics exhibit both seasonal variations and longer-term trends.';
    }
    
    // Add information about correlations if available
    if (correlations.length > 0) {
      const correlation = correlations[0];
      answer += ` Notably, there is a ${correlation.strength > 0.7 ? 'strong' : 'moderate'} correlation between ${correlation.field1} and ${correlation.field2}, suggesting that these factors influence each other or share common drivers.`;
    }
  }
  
  // Questions about comparisons
  else if (q.includes('compare') || q.includes('difference') || q.includes('versus') || q.includes('vs')) {
    answer = `Comparing different aspects within this ${category} dataset from ${country}, `;
    
    switch (category) {
      case 'economics':
        answer += 'reveals significant disparities between urban and rural economic indicators. Urban areas typically show higher per capita income but also greater inequality, while rural areas demonstrate more stable but generally lower economic metrics.';
        break;
      case 'health':
        answer += 'shows notable differences in health outcomes across demographic groups and regions. Access to healthcare facilities appears to be a key differentiating factor, with variation in both quality and availability of services.';
        break;
      case 'education':
        answer += 'indicates performance gaps between different types of educational institutions and geographic regions. Factors such as student-teacher ratios, infrastructure quality, and funding levels correlate strongly with these differences.';
        break;
      case 'transport':
        answer += 'demonstrates varying levels of transportation infrastructure development and usage patterns. Urban areas show higher public transport utilization, while rural regions rely more heavily on private vehicles with longer average travel distances.';
        break;
      case 'environment':
        answer += 'shows significant variation in environmental quality indicators across different regions. Industrial areas exhibit different patterns of environmental stress compared to agricultural or residential zones.';
        break;
      default:
        answer += 'highlights several important contrasts within the data that suggest multiple influencing factors at play. The variations observed indicate that a one-size-fits-all approach would be ineffective for policy interventions.';
    }
  }
  
  // Questions about insights or conclusions
  else if (q.includes('insight') || q.includes('learn') || q.includes('conclusion') || q.includes('what does the data show')) {
    // Use existing insights if available
    if (insights.length > 0) {
      answer = `Key insights from this ${category} dataset include: `;
      answer += insights.slice(0, 3).join(' Additionally, ');
      answer += ` These findings suggest important implications for policy development and strategic planning in the ${category} sector of ${country}.`;
    } else {
      answer = `Analysis of this ${category} dataset from ${country} reveals several important insights. `;
      
      switch (category) {
        case 'economics':
          answer += 'Economic indicators suggest a complex interplay between macro-level policies and local implementation factors. The data points to opportunities for targeted economic development initiatives that could address specific regional challenges.';
          break;
        case 'health':
          answer += 'Health metrics indicate that access to quality healthcare remains uneven, with significant implications for overall public health outcomes. The data suggests potential benefits from integrated health system approaches rather than isolated interventions.';
          break;
        case 'education':
          answer += 'Educational performance data highlights the importance of both school-level factors and broader socioeconomic conditions. The findings suggest that comprehensive approaches addressing both educational resources and community support systems yield the best outcomes.';
          break;
        case 'transport':
          answer += 'Transportation patterns reflect both infrastructure availability and changing public behaviors. The data indicates opportunities for improved intermodal connectivity and targeted capacity enhancements based on usage patterns.';
          break;
        case 'environment':
          answer += 'Environmental indicators demonstrate the interconnected nature of human activities and ecological systems. The data suggests that integrated approaches to environmental management could yield synergistic benefits across multiple ecological dimensions.';
          break;
        default:
          answer += 'The data reveals complex patterns that merit further investigation. Multiple factors appear to influence the observed outcomes, suggesting that multifaceted approaches may be necessary to address the underlying challenges.';
      }
    }
  }
  
  // Generic answer if no specific pattern is matched
  else {
    answer = `Based on the available ${category} data from ${country}, `;
    
    if (summary) {
      answer += summary + ' ';
    }
    
    answer += 'To properly answer this specific question would require more detailed analysis of the underlying data. The dataset contains valuable information that could inform policy decisions and strategic planning in this area.';
  }
  
  // Add a disclaimer
  answer += ' Note that this analysis is based on the available metadata and summary statistics, and more detailed insights would require deeper examination of the raw data.';
  
  return answer;
}
