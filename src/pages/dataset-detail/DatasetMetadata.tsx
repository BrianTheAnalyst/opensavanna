
import { Dataset } from '@/types/dataset';

interface DatasetMetadataProps {
  dataset: Dataset;
}

const DatasetMetadata = ({ dataset }: DatasetMetadataProps) => {
  const defaultDataFields = [
    { name: 'date', description: 'Date of the data point', type: 'Date' },
    { name: 'value', description: 'Numeric value for the metric', type: 'Number' },
    { name: 'region', description: 'Geographic region', type: 'String' }
  ];

  return (
    <>
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Data Fields</h2>
        <p className="text-foreground/70 mb-6">
          This dataset contains the following data fields. Understanding these fields will help you work with and analyze the data effectively.
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
              {(dataset?.dataFields || defaultDataFields).map((field: any, index: number) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 border-b border-border/50 text-sm font-medium">{field.name}</td>
                  <td className="p-3 border-b border-border/50 text-sm">{field.description}</td>
                  <td className="p-3 border-b border-border/50 text-sm">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
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
          <h2 className="text-xl font-medium mb-4">Data Collection Methodology</h2>
          <p className="text-foreground/70 mb-3">
            This dataset was compiled using standardized methodologies for economic data collection:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-foreground/70">
            <li>Quarterly aggregation of official economic statistics</li>
            <li>Verification against government and international organization reports</li>
            <li>Data normalization to ensure consistency across regions</li>
            <li>Quality control processes to identify and correct anomalies</li>
            <li>Rigorous peer review by economic experts</li>
          </ul>
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Data Quality and Limitations</h2>
          <p className="text-foreground/70 mb-3">
            While we strive for accuracy, users should be aware of the following considerations:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-foreground/70">
            <li>Some regions may have incomplete data for certain time periods</li>
            <li>Economic definitions may vary slightly between different countries</li>
            <li>Data collection methodologies improved over time, with more recent data being more reliable</li>
            <li>Inflation adjustments may be needed for long-term comparisons</li>
            <li>Regional aggregations may mask important sub-regional variations</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DatasetMetadata;
