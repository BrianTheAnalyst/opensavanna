
import { Dataset } from '@/types/dataset';
import { Info, Calendar, FileText, MapPin, Database, Download } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center text-primary mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Last Updated</h3>
            </div>
            <p className="text-foreground/70">{dataset.date}</p>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center text-primary mb-2">
              <FileText className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Format</h3>
            </div>
            <p className="text-foreground/70">{dataset.format}</p>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center text-primary mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Region</h3>
            </div>
            <p className="text-foreground/70">{dataset.country}</p>
          </div>
        </div>
      </div>

      <div className="glass border border-border/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Data Fields</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {dataFields.length} Fields
          </span>
        </div>
        
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
                  <td className="p-3 border-b border-border/50 text-sm text-foreground/70">{field.description}</td>
                  <td className="p-3 border-b border-border/50">
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full">
                      {field.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-medium">Collection Method</h2>
          </div>
          
          <ul className="space-y-3 list-disc pl-5 text-foreground/70">
            <li>Standardized data collection protocols</li>
            <li>Regular quality assurance checks</li>
            <li>Automated validation processes</li>
            <li>Expert review and verification</li>
            <li>Consistent formatting and normalization</li>
          </ul>
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-medium">Usage Notes</h2>
          </div>
          
          <ul className="space-y-3 list-disc pl-5 text-foreground/70">
            <li>Data is updated {dataset.date}</li>
            <li>Compatible with standard analysis tools</li>
            <li>Includes detailed field descriptions</li>
            <li>Historical data preservation</li>
            <li>Follows open data standards</li>
          </ul>
        </div>
      </div>
      
      {dataset.license && (
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">License Information</h2>
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-foreground/70">{dataset.license}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetMetadata;
