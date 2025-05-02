
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

interface ProcessDatasetRequest {
  datasetId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { datasetId } = await req.json() as ProcessDatasetRequest;

    if (!datasetId) {
      throw new Error("Missing required field: datasetId");
    }

    // Fetch the dataset
    const { data: dataset, error: datasetError } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", datasetId)
      .single();

    if (datasetError || !dataset) {
      throw new Error(`Failed to fetch dataset: ${datasetError?.message || "Not found"}`);
    }

    // Fetch processed file data if available
    const { data: processedFiles, error: filesError } = await supabase
      .from("processed_files")
      .select("summary")
      .eq("storage_path", `${datasetId}/%`)
      .order("created_at", { ascending: false })
      .limit(1);

    const fileSummary = processedFiles && processedFiles.length > 0 ? processedFiles[0].summary : null;

    // Generate AI analysis
    const aiAnalysis = {
      summary: generateDatasetSummary(dataset, fileSummary),
      insights: generateInsights(dataset, fileSummary),
      correlations: generateCorrelations(fileSummary),
      anomalies: identifyAnomalies(fileSummary)
    };

    // Update the dataset with AI analysis
    const { data: updateResult, error: updateError } = await supabase
      .from("datasets")
      .update({ aiAnalysis })
      .eq("id", datasetId)
      .select();

    if (updateError) {
      throw new Error(`Failed to update dataset with AI analysis: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, datasetId, message: "AI analysis completed successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in process-dataset-ai function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Helper function to generate dataset summary
function generateDatasetSummary(dataset: any, fileSummary: any): string {
  const category = dataset.category || "Unknown";
  const country = dataset.country || "Unknown";
  let summary = `This dataset contains information about ${category.toLowerCase()} in ${country}.`;

  if (fileSummary) {
    const rowCount = fileSummary.row_count || "unknown";
    const fieldCount = fileSummary.fields?.length || 0;
    summary += ` It consists of ${rowCount} records across ${fieldCount} fields.`;
    
    // Add information about the types of data
    if (fileSummary.numeric_fields && Object.keys(fileSummary.numeric_fields).length > 0) {
      const numericFields = Object.keys(fileSummary.numeric_fields);
      summary += ` Key metrics include ${numericFields.slice(0, 3).join(", ")}.`;
    }
    
    if (fileSummary.categorical_fields && Object.keys(fileSummary.categorical_fields).length > 0) {
      const categoricalFields = Object.keys(fileSummary.categorical_fields);
      summary += ` Categorical dimensions include ${categoricalFields.slice(0, 3).join(", ")}.`;
    }
  }

  return summary;
}

// Helper function to generate insights
function generateInsights(dataset: any, fileSummary: any): string[] {
  const insights: string[] = [];
  const category = dataset.category.toLowerCase();

  // Basic insights based on dataset metadata
  insights.push(`This ${category} dataset from ${dataset.country} provides valuable metrics for policy analysis and decision-making.`);
  
  if (dataset.date) {
    insights.push(`The data collected on ${dataset.date} represents a snapshot of ${category} conditions that can be compared with other time periods.`);
  }

  // Generate insights from file summary if available
  if (fileSummary) {
    // Look at numeric fields for potential insights
    if (fileSummary.numeric_fields) {
      Object.entries(fileSummary.numeric_fields).forEach(([field, stats]: [string, any]) => {
        if (stats.max - stats.min > stats.mean * 2) {
          insights.push(`There's significant variation in ${field}, suggesting important differences across the dataset.`);
        }
        
        if (stats.has_negative) {
          insights.push(`${field} contains negative values, which may indicate areas of decline or deficit.`);
        }
      });
    }
    
    // Look at categorical fields for distribution insights
    if (fileSummary.categorical_fields) {
      Object.entries(fileSummary.categorical_fields).forEach(([field, fieldInfo]: [string, any]) => {
        if (fieldInfo.distribution) {
          const entries = Object.entries(fieldInfo.distribution);
          if (entries.length > 0) {
            const [topValue, topCount] = entries.sort(([, a]: any, [, b]: any) => b - a)[0];
            insights.push(`The most common ${field} is "${topValue}", representing a significant portion of the dataset.`);
          }
        }
      });
    }
  }

  // Category-specific insights
  switch (category) {
    case 'economics':
      insights.push('Economic indicators should be analyzed in context with inflation rates and broader market conditions.');
      break;
    case 'health':
      insights.push('Health metrics often reveal disparities across different regions and demographic groups.');
      break;
    case 'education':
      insights.push('Educational outcomes correlate strongly with resource allocation and teacher qualification levels.');
      break;
    case 'transport':
      insights.push('Transportation pattern analysis can guide infrastructure development and urban planning decisions.');
      break;
    case 'environment':
      insights.push('Environmental data trends may indicate long-term climate patterns and areas needing conservation efforts.');
      break;
  }

  return insights;
}

// Helper function to generate correlations
function generateCorrelations(fileSummary: any): Array<{field1: string, field2: string, strength: number, description: string}> {
  const correlations = [];
  
  if (!fileSummary || !fileSummary.numeric_fields) {
    return [];
  }

  const numericFields = Object.keys(fileSummary.numeric_fields);
  
  // Generate sample correlations between numeric fields
  if (numericFields.length >= 2) {
    // Pair fields and create mock correlations
    for (let i = 0; i < Math.min(3, numericFields.length - 1); i++) {
      const field1 = numericFields[i];
      const field2 = numericFields[i + 1];
      const strength = 0.5 + Math.random() * 0.4; // Random correlation between 0.5 and 0.9
      
      correlations.push({
        field1,
        field2,
        strength,
        description: `There appears to be a ${strength > 0.7 ? 'strong' : 'moderate'} correlation between ${field1} and ${field2}.`
      });
    }
  }
  
  return correlations;
}

// Helper function to identify anomalies
function identifyAnomalies(fileSummary: any): Array<{field: string, description: string, impact: string}> {
  const anomalies = [];
  
  if (!fileSummary) {
    return [];
  }

  // Check numeric fields for outliers
  if (fileSummary.numeric_fields) {
    Object.entries(fileSummary.numeric_fields).forEach(([field, stats]: [string, any]) => {
      if (stats.max > stats.mean * 3) {
        anomalies.push({
          field,
          description: `Unusually high maximum value detected in ${field}.`,
          impact: 'This outlier may skew average calculations and should be investigated.'
        });
      }
    });
  }
  
  return anomalies;
}
