
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Dataset } from '@/types/dataset';

interface DatasetApiAccessProps {
  dataset: Dataset;
}

const DatasetApiAccess = ({ dataset }: DatasetApiAccessProps) => {
  return (
    <>
      <div className="glass border border-border/50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">API Access</h2>
        <p className="text-foreground/70 mb-6">
          Integrate this dataset directly into your applications using our RESTful API. Below are examples of how to access this specific dataset programmatically.
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">API Endpoint</h3>
          <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
            <code className="text-sm font-mono">https://api.opendata.org/v1/datasets/{dataset.id}</code>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Example Request (JavaScript)</h3>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`fetch('https://api.opendata.org/v1/datasets/${dataset.id}')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error(error));`}
            </pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Example Request (Python)</h3>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`import requests

response = requests.get('https://api.opendata.org/v1/datasets/${dataset.id}')
data = response.json()
print(data)`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">API Parameters</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Filtering</h3>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?region=east-africa</code> - Filter by region
              </p>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?year=2022</code> - Filter by year
              </p>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?metric=gdp</code> - Filter by metric
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Pagination</h3>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?limit=100</code> - Number of results
              </p>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?offset=200</code> - Pagination offset
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Sorting</h3>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?sort=year</code> - Sort by field
              </p>
              <p className="text-sm text-foreground/70">
                <code className="bg-muted px-1 py-0.5 rounded">?order=desc</code> - Sort direction
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">API Authentication</h2>
          <p className="text-foreground/70 mb-4">
            Authentication is required for higher rate limits and access to premium features.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">API Key Authentication</h3>
              <p className="text-sm text-foreground/70">
                Add your API key to the request header:
              </p>
              <pre className="bg-muted px-3 py-2 mt-2 rounded text-xs font-mono">
                Authorization: ApiKey YOUR_API_KEY
              </pre>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Rate Limits</h3>
              <p className="text-sm text-foreground/70">
                Anonymous: 60 requests/hour<br />
                Authenticated: 1,000 requests/hour<br />
                Premium: 10,000 requests/hour
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button size="sm" className="w-full rounded-lg">
              Get API Key
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Link to="/api" className="text-primary hover:underline flex items-center">
          View Complete API Documentation
          <ArrowLeft className="h-4 w-4 ml-1 transform rotate-180" />
        </Link>
      </div>
    </>
  );
};

export default DatasetApiAccess;
