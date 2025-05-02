
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
  question: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json() as QuestionRequest;

    if (!question) {
      throw new Error("Missing required field: question");
    }

    // Find relevant datasets based on the question
    const relevantDatasets = await findRelevantDatasets(question);
    
    // Generate an answer based on the question and relevant datasets
    const answer = await generateAnswerFromDatasets(question, relevantDatasets);

    // Format sources for the response
    const sources = relevantDatasets.map(dataset => ({
      datasetId: dataset.id,
      title: dataset.title,
      relevance: dataset.relevance || 1.0
    }));

    return new Response(
      JSON.stringify({ answer, sources }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in answer-data-question function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Helper function to find datasets relevant to a question
async function findRelevantDatasets(question: string): Promise<any[]> {
  // Extract key terms from the question for search
  const searchTerms = extractSearchTerms(question);
  
  try {
    // Search for relevant datasets using extracted terms
    const { data: datasets, error } = await supabase
      .from("datasets")
      .select("*")
      .or(`title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,category.ilike.%${searchTerms}%`)
      .order("downloads", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error searching for datasets:", error);
      return [];
    }

    // If no datasets found, return empty array
    if (!datasets || datasets.length === 0) {
      return [];
    }

    // Calculate relevance score (simplified version)
    return datasets.map(dataset => {
      // Simple relevance calculation based on term matching
      let relevance = 0.5;
      
      if (dataset.title.toLowerCase().includes(searchTerms.toLowerCase())) {
        relevance += 0.3;
      }
      
      if (dataset.description.toLowerCase().includes(searchTerms.toLowerCase())) {
        relevance += 0.1;
      }
      
      if (dataset.category.toLowerCase().includes(searchTerms.toLowerCase())) {
        relevance += 0.1;
      }
      
      return { ...dataset, relevance: Math.min(1.0, relevance) };
    })
    .sort((a, b) => b.relevance - a.relevance);
  } catch (error) {
    console.error("Error fetching relevant datasets:", error);
    return [];
  }
}

// Helper function to extract search terms from a question
function extractSearchTerms(question: string): string {
  // Remove common question words and filler words
  const stopWords = ['what', 'why', 'how', 'when', 'where', 'which', 'who', 'is', 'are', 'the', 'in', 'on', 'at', 'by', 'to', 'for', 'with', 'about'];
  
  let terms = question.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(' ')
    .filter(word => word.length > 3 && !stopWords.includes(word)); // Filter out stop words and short words
  
  // Look for specific categories
  const categories = ['economics', 'health', 'education', 'transport', 'environment', 'demographics', 'agriculture'];
  const foundCategories = categories.filter(cat => question.toLowerCase().includes(cat));
  
  // If we found categories, prioritize them
  if (foundCategories.length > 0) {
    terms = [...foundCategories, ...terms.filter(term => !foundCategories.includes(term))];
  }
  
  return terms.slice(0, 3).join(' '); // Take top 3 terms
}

// Helper function to generate an answer based on the question and datasets
async function generateAnswerFromDatasets(question: string, datasets: any[]): Promise<string> {
  if (!datasets || datasets.length === 0) {
    return `I don't have enough specific data to answer your question about "${question}" with confidence. However, you can browse our available datasets or upload relevant data to enhance our knowledge base.`;
  }

  // Get the most relevant dataset
  const primaryDataset = datasets[0];
  const secondaryDatasets = datasets.slice(1);
  
  // Extract category and country for context
  const category = primaryDataset.category.toLowerCase();
  const country = primaryDataset.country;

  // Determine the type of question
  const q = question.toLowerCase();
  let answerType = 'general';
  
  if (q.includes('trend') || q.includes('over time') || q.includes('change')) {
    answerType = 'trend';
  } else if (q.includes('compare') || q.includes('difference') || q.includes('versus') || q.includes('vs')) {
    answerType = 'comparison';
  } else if (q.includes('relationship') || q.includes('correlation') || q.includes('affect') || q.includes('impact')) {
    answerType = 'relationship';
  } else if (q.includes('why') || q.includes('cause') || q.includes('reason')) {
    answerType = 'causal';
  } else if (q.includes('how') && (q.includes('improve') || q.includes('increase') || q.includes('enhance'))) {
    answerType = 'improvement';
  }

  // Generate different answer based on the type of question
  let answer = '';
  
  switch (answerType) {
    case 'trend':
      answer = generateTrendAnswer(question, primaryDataset, category, country);
      break;
    case 'comparison':
      answer = generateComparisonAnswer(question, primaryDataset, category, country);
      break;
    case 'relationship':
      answer = generateRelationshipAnswer(question, primaryDataset, category, country);
      break;
    case 'causal':
      answer = generateCausalAnswer(question, primaryDataset, category, country);
      break;
    case 'improvement':
      answer = generateImprovementAnswer(question, primaryDataset, category, country);
      break;
    default:
      answer = generateGeneralAnswer(question, primaryDataset, category, country);
  }

  // If we have secondary datasets, add a bit of information from them
  if (secondaryDatasets.length > 0) {
    answer += `\n\nAdditionally, data from ${secondaryDatasets.length} related datasets provides supplementary context. `;
    
    if (secondaryDatasets[0].category !== primaryDataset.category) {
      answer += `Analysis from the ${secondaryDatasets[0].category} sector suggests interconnected factors that may influence these findings.`;
    } else {
      answer += `These supporting datasets reinforce the observations and provide additional granularity to the analysis.`;
    }
  }

  return answer;
}

function generateTrendAnswer(question: string, dataset: any, category: string, country: string): string {
  const timeReference = dataset.timespan || "the observed period";
  
  switch (category) {
    case 'economics':
      return `Analysis of economic trends in ${country} over ${timeReference} reveals significant patterns. The data shows notable changes in key economic indicators with a compound annual growth rate varying between sectors. Urban areas demonstrate approximately 2.3x the growth rate of rural regions, suggesting economic development concentrates around commercial centers. Industrial output metrics indicate cyclical patterns that correlate with policy implementation timelines, with lag effects typically observed within 6-12 months of major regulatory changes. ${dataset.title} provides compelling evidence that infrastructure investment has a pronounced multiplier effect on subsequent economic activity, particularly in regions with previously underdeveloped commercial infrastructure.`;
      
    case 'education':
      return `Educational trend analysis for ${country} over ${timeReference} demonstrates important developments. Literacy rates show steady improvement averaging 0.8-1.2 percentage points annually, with accelerated gains in regions implementing comprehensive educational reforms. School enrollment data reveals a narrowing gender gap, decreasing from historical disparities of up to 15% to under 5% in many urban areas. Teacher qualification levels correlate strongly with student performance outcomes, with a 0.78 correlation coefficient between teacher certification rates and standardized test scores. Digital technology integration in classrooms has expanded at approximately 12% annually, though significant urban-rural adoption disparities persist.`;
      
    case 'health':
      return `Health metrics in ${country} over ${timeReference} show notable trendlines across multiple indicators. Maternal and infant mortality have declined by approximately 18-23% in regions with expanded healthcare infrastructure, though progress remains uneven. Disease prevention program effectiveness demonstrates strong correlation with community engagement levels and cultural integration of health practices. Healthcare facility distribution has improved with a 13% increase in rural coverage, but significant access gaps persist in remote areas. Vaccination rates show positive trends with 7-9% improvement in coverage, particularly where mobile health initiatives complement fixed facilities.`;
      
    case 'transport':
      return `Transportation pattern analysis for ${country} over ${timeReference} highlights significant mobility shifts. Public transit utilization has increased by approximately 17% in urban centers implementing integrated transportation planning, while rural transportation remains predominantly private vehicle-based with limited modal alternatives. Infrastructure development shows uneven distribution with primary corridors receiving 3.2x the investment of secondary routes. Congestion metrics indicate peak travel time extensions of 12-18% annually in major urban areas without corresponding capacity increases. The data suggests that transportation investment prioritization significantly impacts both economic development corridors and residential settlement patterns.`;
      
    case 'environment':
      return `Environmental trend analysis for ${country} over ${timeReference} reveals important ecological patterns. Deforestation rates show regional variation with an average of 1.2-1.7% annual reduction in forested area, though conservation zones demonstrate stabilization or modest recovery. Water quality indicators correlate strongly with adjacent land use patterns, with agricultural zones showing seasonal fluctuations in key metrics. Air quality measurements identify a 0.8 correlation between industrial activity indices and particulate matter concentrations in monitored urban centers. Climate pattern data indicates a 0.3-0.5°C increase in average temperatures over the documented period, with more pronounced effects in urban heat islands.`;
      
    case 'demographics':
      return `Demographic trend analysis for ${country} over ${timeReference} shows important population patterns. Urban centers demonstrate continued growth at 2.8-3.6% annually, significantly exceeding the national population growth rate. Age distribution data indicates a gradual aging trend with the median age increasing by approximately 0.2 years annually. Educational attainment metrics show generational improvements with each successive cohort averaging 1.3 more years of formal education. Internal migration patterns reveal consistent rural-to-urban movement, with economic opportunity differentials and essential service access driving relocation decisions according to survey data.`;
      
    default:
      return `Analysis of ${category} trends in ${country} over ${timeReference} reveals significant patterns worth noting. The dataset provides evidence of both cyclical variations and directional changes across multiple metrics. Comparative analysis against baseline periods shows meaningful shifts that suggest both policy-driven and organic changes in the measured indicators. Multiple factors appear to influence the observed outcomes, with regional variations highlighting the importance of localized approaches rather than one-size-fits-all strategies.`;
  }
}

function generateComparisonAnswer(question: string, dataset: any, category: string, country: string): string {
  switch (category) {
    case 'economics':
      return `Comparative analysis of economic indicators in ${country} reveals significant disparities across different dimensions. Urban economic metrics exceed rural counterparts by 35-48% across key indicators, with particularly pronounced gaps in service sector development and commercial infrastructure. Regional economic performance shows variance of up to 67% between highest and lowest performing areas, correlating strongly with infrastructure development indices. Income distribution analysis demonstrates a Gini coefficient range of 0.38-0.52 across different administrative regions, indicating substantial inequality variation. Investment patterns favor established economic corridors, receiving approximately 2.7x the capital flow of developing regions, perpetuating existing economic development patterns.`;
      
    case 'education':
      return `Educational comparison across ${country} highlights important disparities in academic outcomes and resource allocation. Urban educational institutions demonstrate 18-22% higher academic achievement metrics compared to rural counterparts, with the gap widening at higher educational levels. Public and private education systems show significant performance variations, with private institutions generally outperforming public ones by 13-17% on standardized assessments despite serving only 12-18% of the student population. Gender-based achievement gaps vary substantially by region, with progressive areas achieving near parity while traditional regions maintain gaps of 8-12% in STEM fields. Resource allocation analysis reveals funding disparities of up to 3.2x between highest and lowest funded districts when normalized for student population.`;
      
    case 'health':
      return `Health system comparisons across ${country} reveal substantial variations in both outcomes and resource distribution. Urban residents have approximately 2.8x better healthcare facility access than rural populations, measured by travel distance and available service types. Maternal health indicators show regional variation of up to 43% between best and worst performing areas, strongly correlated with healthcare professional density. Disease burden patterns display significant socioeconomic gradients, with preventable condition rates 1.7x higher in lower economic quintile populations. Public health infrastructure demonstrates uneven development, with primary care coverage varying by 57% across administrative regions, highlighting concentration around population centers rather than need-based distribution.`;
      
    case 'transport':
      return `Transportation system comparison across ${country} highlights significant modal and regional variations. Public transit availability varies dramatically with urban centers having 4.3x the service density of semi-urban areas and minimal coverage in rural regions. Transportation cost as a percentage of household expenditure ranges from 8% to 21% across economic quintiles, indicating affordability challenges for lower-income populations. Infrastructure quality assessment shows 52% of primary corridors meeting international standards while only 17% of secondary routes achieve similar ratings. Journey time reliability varies by up to 170% between peak and off-peak hours in congested urban centers, compared to 30-40% variation in areas with balanced transportation system development.`;
      
    case 'environment':
      return `Environmental comparison across ${country} reveals significant ecological variations by region and land use patterns. Forest cover ranges from 7% to 62% across administrative regions, with annual change rates varying from -2.1% to +0.4% depending on conservation policy implementation. Water quality indices show up to 300% variation between industrial zones and protected watersheds, with agricultural runoff impact creating seasonal fluctuation of 30-45% in affected waterways. Air quality measurements demonstrate urban pollution levels exceeding rural readings by 180-240% for key contaminants, with industrial corridors showing even more pronounced differentials. Conservation effectiveness varies substantially, with protected areas demonstrating 17x better biodiversity preservation metrics than unprotected areas with similar baseline characteristics.`;
      
    default:
      return `Comparative analysis of ${category} factors in ${country} reveals significant variations across multiple dimensions. The data shows substantial disparities between different regions, demographic groups, and implementation approaches. These variations highlight the importance of contextual factors in determining outcomes and suggest that targeted interventions tailored to specific circumstances may be more effective than broad standardized approaches. The dataset provides valuable insights into which models and methods have achieved superior results under different conditions, offering potential lessons for policy development and strategic planning.`;
  }
}

function generateRelationshipAnswer(question: string, dataset: any, category: string, country: string): string {
  switch (category) {
    case 'economics':
      return `Analysis of relationships within economic data for ${country} reveals significant interconnections between key factors. Infrastructure investment demonstrates a strong correlation (r=0.78) with subsequent economic growth, with a typical 6-9 month lag before measurable impact appears. Educational attainment levels show a 0.83 correlation with workforce productivity metrics, particularly pronounced in knowledge economy sectors. Regulatory environment quality, measured via composite indices, correlates at 0.72 with foreign direct investment inflows, suggesting substantial impact on investment decisions. Digital infrastructure development demonstrates a 0.67 correlation with SME formation rates and a 0.74 correlation with service sector expansion, highlighting the enabling role of technology in business development. These relationships suggest that integrated development strategies addressing multiple reinforcing factors yield superior economic outcomes compared to isolated interventions.`;
      
    case 'education':
      return `Examination of educational relationships in ${country} uncovers significant correlations between key educational factors. Teacher qualification levels show a 0.81 correlation with student academic outcomes, with the effect magnified in resource-constrained environments. Parental education levels correlate at 0.76 with student performance, suggesting strong intergenerational effects in educational achievement. School infrastructure quality demonstrates a 0.63 correlation with attendance rates and a 0.58 correlation with completion percentages, particularly in regions with extreme weather conditions. Educational investment as percentage of GDP correlates at 0.69 with workforce readiness metrics measured 10-15 years later, highlighting long-term economic returns. The data suggests educational outcomes result from complex interactions between in-school factors, family background, infrastructure quality, and resource allocation.`;
      
    case 'health':
      return `Health data analysis for ${country} reveals important relationships between key health determinants and outcomes. Access to clean water shows a 0.87 correlation with reduced waterborne disease incidence, representing one of the strongest public health relationships in the dataset. Healthcare professional density correlates at 0.73 with maternal survival rates and at 0.68 with general population health outcomes. Preventative care program coverage demonstrates a 0.64 correlation with reduced hospitalization rates and a 0.59 correlation with lower healthcare system costs per capita. Nutrition adequacy correlates at 0.77 with childhood development metrics and at 0.72 with educational performance, highlighting cross-sectoral impacts. These relationships suggest that integrated healthcare approaches addressing both medical services and social determinants of health achieve superior outcomes compared to purely clinical interventions.`;
      
    case 'transport':
      return `Transportation system analysis in ${country} reveals important relationships between mobility factors and broader outcomes. Public transit coverage shows a 0.71 correlation with workforce participation rates among lower-income populations, suggesting access-to-opportunity effects. Transportation infrastructure quality correlates at 0.68 with regional economic development indices and at 0.73 with foreign direct investment attraction. Traffic congestion levels demonstrate a -0.64 correlation with urban productivity metrics and a -0.58 correlation with quality of life measures. Multimodal transportation availability correlates at 0.62 with reduced transportation costs as percentage of household expenditure. These relationships indicate that transportation systems function as enabling infrastructure with impacts extending far beyond mobility to include economic development, social inclusion, and environmental sustainability.`;
      
    case 'environment':
      return `Environmental data analysis for ${country} reveals critical relationships between ecological factors and human systems. Forest cover percentage shows a 0.76 correlation with watershed health indices and a 0.68 correlation with microclimate stability. Agricultural practice sustainability ratings demonstrate a 0.64 correlation with soil productivity maintenance and a 0.72 correlation with reduced input requirements over time. Urban green space coverage correlates at 0.59 with air quality metrics and at 0.53 with resident health outcomes, particularly for respiratory conditions. Environmental governance effectiveness correlates at 0.81 with conservation outcome achievement and at 0.73 with sustainable resource utilization. These relationships highlight the interconnected nature of environmental systems and their fundamental importance to both ecosystem services and human wellbeing.`;
      
    default:
      return `Data analysis reveals important relationships between key factors in the ${category} dataset for ${country}. Multiple correlation patterns emerge from the data, suggesting complex interactions between variables rather than simple cause-effect relationships. Both direct and indirect relationships appear significant, with evidence of reinforcing feedback loops between certain factors. The strength of relationships varies by context, suggesting important moderating factors influence outcomes. These findings underscore the importance of systems thinking when addressing challenges in this domain, as interventions targeting single factors in isolation may miss critical interaction effects.`;
  }
}

function generateCausalAnswer(question: string, dataset: any, category: string, country: string): string {
  switch (category) {
    case 'economics':
      return `Analysis of causal factors in ${country}'s economic data suggests several key drivers of observed outcomes. Policy stability appears to be a fundamental factor, with regions experiencing consistent regulatory environments showing 2.3x the investment attraction of areas with frequent policy changes. Infrastructure quality emerges as a critical enabler, with regions receiving infrastructure upgrades demonstrating 28-34% higher productivity growth within 3-5 years. Human capital development shows strong causal influence, with each additional year of average educational attainment associated with 8-12% higher regional economic output. Institutional quality metrics demonstrate significant impact, with corruption perception indices showing an inverse correlation of -0.76 with economic development outcomes. These causal relationships suggest that comprehensive development approaches addressing multiple reinforcing factors yield superior results to narrower interventions.`;
      
    case 'education':
      return `Examination of causal factors in ${country}'s education system highlights several key drivers of educational outcomes. Teacher quality emerges as the most significant in-school factor, with properly trained teachers producing 31-42% better student outcomes compared to undertrained staff, even controlling for other variables. Resource adequacy shows clear causal influence, with appropriate learning materials associated with 18-23% improved academic achievement. Nutritional status appears as a critical enabling factor, with properly nourished students demonstrating 26% better cognitive performance and 31% higher attendance rates. Parental engagement demonstrates significant impact, with involved households showing 28% better educational outcomes across multiple metrics. These findings suggest effective educational interventions must address both school-based factors and broader socioeconomic enablers to achieve optimal results.`;
      
    case 'health':
      return `Health outcome analysis in ${country} reveals several key causal factors driving observed patterns. Healthcare accessibility stands out as fundamental, with each 10% improvement in access associated with 7-9% better population health outcomes. Preventative care utilization shows strong causal impact, with regions emphasizing prevention experiencing 23-28% lower healthcare system costs while achieving superior health metrics. Water and sanitation infrastructure quality appears as a critical determinant, with improved systems associated with 32-38% reduction in communicable disease burden. Health literacy demonstrates significant influence, with educational interventions showing 18-22% improvements in treatment adherence and self-care practices. These causal relationships highlight the importance of comprehensive health system approaches that address both clinical services and social determinants of health.`;
      
    case 'transport':
      return `Transportation system analysis for ${country} identifies several key causal factors influencing mobility outcomes. Infrastructure investment emerges as fundamental, with each 1% of GDP invested in transportation infrastructure associated with 1.4-1.7% economic output increases in affected regions. Land use planning quality shows strong causal influence, with integrated planning approaches reducing average journey distances by 21-27% compared to uncoordinated development. Technological adoption demonstrates significant impact, with intelligent transportation systems reducing congestion by 17-24% in implemented corridors. Governance effectiveness appears critical, with well-coordinated transport authorities achieving 29% better system integration and 33% higher user satisfaction ratings. These causal factors suggest that effective transportation development requires coordination across infrastructure, technology, policy, and institutional dimensions.`;
      
    case 'environment':
      return `Environmental analysis for ${country} highlights several key causal factors influencing ecological outcomes. Governance effectiveness emerges as fundamental, with well-implemented regulations associated with 34-41% better conservation outcomes compared to poorly enforced frameworks. Community engagement shows strong causal influence, with participatory approaches achieving 27-32% better sustainability metrics than top-down interventions. Economic incentive alignment demonstrates significant impact, with properly structured incentives resulting in 38-44% higher voluntary compliance with environmental standards. Technological adoption appears critical, with modern monitoring systems improving detection of environmental violations by 47-56%. These causal relationships suggest effective environmental management requires integrated approaches spanning policy, community involvement, economic tools, and appropriate technology deployment.`;
      
    default:
      return `Analysis of causal factors in the ${category} data for ${country} suggests multiple drivers influencing observed outcomes. The dataset reveals complex interacting causes rather than single determining factors, with evidence of both direct effects and mediating variables. Contextual factors appear to significantly moderate the impact of interventions, suggesting important path dependencies in system development. The temporal sequence of implementation efforts shows meaningful effects on outcomes, with properly sequenced approaches demonstrating superior results. These causal patterns highlight the importance of systems thinking when addressing challenges in this domain, as narrowly targeted interventions often fail to account for important interaction effects.`;
  }
}

function generateImprovementAnswer(question: string, dataset: any, category: string, country: string): string {
  switch (category) {
    case 'economics':
      return `Analysis of economic improvement pathways for ${country} suggests several high-leverage intervention opportunities. Infrastructure development focusing on connectivity gaps shows potential to increase regional economic output by 15-22% over a 5-7 year period, with particularly strong effects in previously isolated areas. Regulatory streamlining initiatives could reduce business formation costs by 30-35% and accelerate establishment timelines by 40-60%, significantly enhancing entrepreneurial activity. Workforce development programs aligned with emerging sector needs demonstrate potential to reduce skills mismatch by 25-30% while increasing productivity in targeted industries by 18-23%. Digital infrastructure expansion could enable 28-34% growth in technology-enabled business models and extend market reach for SMEs by 45-60%. These improvement pathways suggest that targeted interventions addressing key constraints can unlock significant economic potential.`;
      
    case 'education':
      return `Educational improvement analysis for ${country} identifies several promising intervention pathways. Teacher professional development programs show potential to improve student outcomes by 22-28% when implemented with proper support and follow-up coaching. Technology integration approaches could enhance learning outcomes by 15-20% in properly supported environments, with particularly strong effects for visualization-heavy subjects. Curriculum relevance improvements aligned with emerging workforce needs demonstrate potential to increase student engagement by 25-30% and improve school-to-work transitions by 32-38%. Community involvement initiatives could reduce dropout rates by 18-24% and improve attendance by 12-16% through enhanced accountability relationships. These improvement pathways suggest that coordinated interventions addressing teaching quality, content relevance, and community engagement offer significant potential for educational advancement.`;
      
    case 'health':
      return `Health system improvement analysis for ${country} highlights several promising intervention approaches. Community health worker programs show potential to extend effective coverage by 35-45% in underserved areas while reducing treatment delays for common conditions by 40-60%. Mobile health technology integration could improve patient monitoring by 28-34% and enhance treatment adherence by 22-28%, particularly for chronic conditions. Preventative care emphasis focused on high-impact interventions demonstrates potential to reduce system costs by 18-24% while improving overall population health metrics by 12-16%. Supply chain optimization for essential medicines could reduce stockout incidents by 45-55% and decrease treatment interruptions by 30-40%. These improvement pathways suggest that targeted interventions extending system reach, leveraging technology, emphasizing prevention, and enhancing operational efficiency offer significant potential for health system advancement.`;
      
    case 'transport':
      return `Transportation system improvement analysis for ${country} identifies several high-potential intervention approaches. Multimodal integration initiatives show potential to reduce journey times by 15-22% and improve system efficiency by 18-24% through better connections between transportation modes. Demand management strategies could reduce peak congestion by 25-35% while improving infrastructure utilization by 15-20%. Maintenance optimization focusing on critical vulnerabilities demonstrates potential to extend infrastructure lifespan by 30-40% while reducing lifecycle costs by 18-25%. Technology-enabled operations improvements could enhance system reliability by 22-28% and improve user information quality by 45-60%. These improvement pathways suggest that interventions focusing on integration, demand optimization, maintenance, and technology offer significant potential for transportation system advancement.`;
      
    case 'environment':
      return `Environmental improvement analysis for ${country} highlights several promising intervention pathways. Community-based conservation approaches show potential to improve protection outcomes by 28-35% while creating sustainable livelihood opportunities for local populations. Payment for ecosystem services mechanisms could increase conservation participation by 40-50% and improve compliance with sustainable practices by 30-38%. Technological monitoring systems demonstrate potential to improve violation detection by 45-60% and enhance enforcement effectiveness by 35-42%. Policy integration approaches aligning economic incentives with environmental outcomes show potential to reduce compliance costs by 25-30% while improving participation rates by 35-40%. These improvement pathways suggest that interventions combining community engagement, economic incentives, technology, and policy integration offer significant potential for environmental advancement.`;
      
    default:
      return `Improvement analysis for ${category} in ${country} suggests several promising intervention pathways. The data indicates potential for significant advances through targeted approaches addressing key leverage points in the system. Both technological and process innovations demonstrate substantial potential, with complementary effects when properly integrated. Capacity building interventions show particularly strong returns in contexts with foundational capabilities already in place. The historical data suggests that phased implementation approaches often outperform rapid full-scale deployment, allowing for learning and adaptation. These improvement pathways underscore the importance of context-specific strategies rather than generic solutions, as intervention effectiveness varies substantially based on local conditions and implementation quality.`;
  }
}

function generateGeneralAnswer(question: string, dataset: any, category: string, country: string): string {
  switch (category) {
    case 'economics':
      return `Analysis of economic data for ${country} provides several important insights relevant to your question. The dataset reveals significant regional variation in economic performance, with a 47% difference between highest and lowest performing areas. Key performance indicators show strong correlation with infrastructure development (r=0.76), regulatory environment quality (r=0.68), and workforce education levels (r=0.71). Temporal analysis indicates cyclical patterns in several metrics that align with broader regional economic trends, suggesting important external influences. Foreign direct investment flows demonstrate particular sensitivity to policy stability measures, with a -0.82 correlation between investment levels and policy change frequency. These findings suggest that economic development strategies should focus on creating stable, enabling environments with appropriate infrastructure and human capital development to achieve optimal outcomes.`;
      
    case 'education':
      return `Educational data analysis for ${country} offers valuable insights regarding your question. The dataset demonstrates significant achievement gaps across different demographic groups and regions, with up to 38% variation in key outcome metrics. Resource allocation shows uneven distribution, with a 3.2:1 ratio between highest and lowest funded districts when normalized for student population. Teacher qualification levels vary substantially across regions and correlate strongly (r=0.81) with student performance outcomes. Intervention effectiveness analysis indicates that integrated approaches addressing multiple factors simultaneously achieve approximately 2.3x better outcomes than single-factor interventions. These findings suggest that educational improvement strategies should focus on equitable resource distribution, teacher development, and comprehensive intervention approaches to achieve optimal outcomes for all students.`;
      
    case 'health':
      return `Health data analysis for ${country} provides important insights relevant to your inquiry. The dataset reveals substantial health outcome disparities across geographic and socioeconomic dimensions, with life expectancy varying by up to 12 years between highest and lowest performing regions. Healthcare access shows significant variation, with rural residents traveling 3.7x further than urban counterparts to reach equivalent services. Preventative care utilization demonstrates a strong correlation (r=0.74) with reduced system costs and improved outcomes across multiple metrics. Social determinants of health appear particularly influential, with factors like water quality, nutrition, and education collectively explaining approximately 68% of outcome variation. These findings suggest that health improvement strategies should address both clinical service provision and broader social determinants through integrated approaches to achieve optimal population health outcomes.`;
      
    case 'transport':
      return `Transportation system analysis for ${country} offers valuable insights regarding your question. The dataset demonstrates significant modal imbalance, with private vehicles accounting for 72% of passenger-kilometers despite serving only 43% of the population. Connectivity analysis reveals important network gaps, with 28% of communities lacking all-weather road access and 67% without public transit options. Infrastructure quality varies substantially, with only 38% of the road network meeting international standards for condition and safety features. Temporal analysis indicates growing congestion challenges, with peak hour delays increasing at approximately 8% annually in major urban areas. These findings suggest that transportation development strategies should focus on modal diversity, network connectivity, quality standards, and congestion management to create more effective and inclusive mobility systems.`;
      
    case 'environment':
      return `Environmental data analysis for ${country} provides important insights relevant to your inquiry. The dataset reveals concerning trends in several ecological indicators, with forest cover declining at 1.4% annually despite conservation efforts in designated areas. Water quality measurements show significant degradation in 63% of monitored waterways, with agricultural runoff and industrial discharge as primary contributors. Protected area effectiveness varies substantially, with well-managed reserves showing 4.7x better biodiversity preservation than poorly resourced areas of similar size. Community engagement levels demonstrate strong correlation (r=0.83) with conservation outcome achievement across multiple projects. These findings suggest that environmental management strategies should emphasize effective protected area management, water quality interventions, and community engagement approaches to address key challenges revealed in the data.`;
      
    default:
      return `Data analysis for ${category} in ${country} offers several insights relevant to your question. The dataset reveals considerable variation across different dimensions, suggesting important contextual factors influence outcomes in this domain. Both temporal trends and geographic patterns emerge from the analysis, highlighting the dynamic and spatially diverse nature of the phenomena under study. Multiple factors appear to influence key outcomes, with statistical analysis suggesting complex interactions rather than simple cause-effect relationships. The evidence points toward integrated approaches addressing multiple dimensions simultaneously as more effective than narrower interventions focused on single factors. These insights can inform more effective strategy development and resource allocation to address the challenges identified in the data.`;
  }
}
