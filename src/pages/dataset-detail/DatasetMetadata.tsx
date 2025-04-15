
import { Dataset } from '@/types/dataset';
import { Info } from 'lucide-react';

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata = ({ dataset }: DatasetMetadataProps) => {
  const defaultDataFields = [
    { name: 'date', description: 'Date of the data point', type: 'Date' },
    { name: 'value', description: 'Numeric value for the metric', type: 'Number' },
    { name: 'region', description: 'Geographic region', type: 'String' }
  ];

  const dataFields = dataset?.dataFields || defaultDataFields;

  return (
    <>
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Data Fields</h2>
        <p className="text-foreground/70 mb-6">
          This dataset contains the following data fields. Understanding these fields 
          will help you work with and analyze the data effectively.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 border-b border-border text-sm font-medium">Field Name</th>
                <th className="text-left p-3 border-b border-border text-sm font-medium">Description</th>
                <th className="text-left p-3 border-b border-border text-sm font-medium">Data Type</th>
              </tr>
            </thead>
            <tbody>
              {dataFields.map((field: any, index: number) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 border-b border-border/50 text-sm font-medium">{field.name}</td>
                  <td className="p-3 border-b border-border/50 text-sm">{field.description}</td>
                  <td className="p-3 border-b border-border/50 text-sm">
                    <span className="text-xs inline-flex items-center bg-secondary px-2 py-1 rounded-full">
                      {field.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-medium">Data Collection Methodology</h2>
            <div className="ml-2 text-primary">
              <Info size={16} />
            </div>
          </div>
          
          <ul className="space-y-3 list-disc pl-5 text-foreground/70">
            <li className="pl-2">Quarterly aggregation of official statistics</li>
            <li className="pl-2">Verification against government and international organization reports</li>
            <li className="pl-2">Data normalization to ensure consistency across regions</li>
            <li className="pl-2">Quality control processes to identify and correct anomalies</li>
            <li className="pl-2">Rigorous peer review by domain experts</li>
          </ul>
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-medium">Data Quality and Limitations</h2>
            <div className="ml-2 text-primary">
              <Info size={16} />
            </div>
          </div>
          
          <ul className="space-y-3 list-disc pl-5 text-foreground/70">
            <li className="pl-2">Some regions may have incomplete data for certain time periods</li>
            <li className="pl-2">Definitions may vary slightly between different countries</li>
            <li className="pl-2">Data collection methodologies improved over time, with more recent data being more reliable</li>
            <li className="pl-2">Inflation adjustments may be needed for long-term comparisons</li>
            <li className="pl-2">Regional aggregations may mask important sub-regional variations</li>
          </ul>
        </div>
      </div>
      
      {dataset.license && (
        <div className="glass border border-border/50 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-medium mb-4">License Information</h2>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-foreground/70">{dataset.license}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DatasetMetadata;
