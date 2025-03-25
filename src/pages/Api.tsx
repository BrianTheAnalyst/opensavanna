
import React from 'react';
import { Copy, Code, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Api = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  const endpoints = [
    {
      name: 'Get All Datasets',
      method: 'GET',
      path: '/api/datasets',
      description: 'Retrieve a list of all available datasets',
      params: [
        { name: 'search', type: 'string', description: 'Search term for filtering datasets' },
        { name: 'category', type: 'string', description: 'Filter by category' },
        { name: 'format', type: 'string', description: 'Filter by file format' },
        { name: 'country', type: 'string', description: 'Filter by country or region' }
      ],
      response: {
        type: 'Array<Dataset>',
        example: `[
  {
    "id": "1",
    "title": "Economic Indicators by Region",
    "description": "Comprehensive collection of economic indicators...",
    "category": "Economics",
    "format": "CSV",
    "country": "Global",
    "date": "Updated June 2023",
    "downloads": 5248
  },
  ...
]`
      }
    },
    {
      name: 'Get Dataset by ID',
      method: 'GET',
      path: '/api/datasets/:id',
      description: 'Retrieve a specific dataset by its ID',
      params: [
        { name: 'id', type: 'string', description: 'Unique identifier for the dataset' }
      ],
      response: {
        type: 'Dataset',
        example: `{
  "id": "1",
  "title": "Economic Indicators by Region",
  "description": "Comprehensive collection of economic indicators...",
  "category": "Economics",
  "format": "CSV",
  "country": "Global",
  "date": "Updated June 2023",
  "downloads": 5248
}`
      }
    },
    {
      name: 'Get Dataset Visualization',
      method: 'GET',
      path: '/api/datasets/:id/visualization',
      description: 'Get visualization data for a specific dataset',
      params: [
        { name: 'id', type: 'string', description: 'Unique identifier for the dataset' }
      ],
      response: {
        type: 'Array<DataPoint>',
        example: `[
  { "name": "Jan", "value": 400 },
  { "name": "Feb", "value": 300 },
  { "name": "Mar", "value": 600 },
  ...
]`
      }
    },
    {
      name: 'Upload Dataset',
      method: 'POST',
      path: '/api/datasets',
      description: 'Upload a new dataset',
      params: [],
      body: {
        type: 'multipart/form-data',
        fields: [
          { name: 'title', type: 'string', description: 'Dataset title' },
          { name: 'description', type: 'string', description: 'Dataset description' },
          { name: 'category', type: 'string', description: 'Dataset category' },
          { name: 'country', type: 'string', description: 'Country or region' },
          { name: 'file', type: 'file', description: 'Dataset file (CSV, JSON, GeoJSON)' }
        ]
      },
      response: {
        type: 'Dataset',
        example: `{
  "id": "10",
  "title": "New Dataset",
  "description": "Description of the new dataset",
  "category": "Health",
  "format": "CSV",
  "country": "Kenya",
  "date": "Updated July 2023",
  "downloads": 0
}`
      }
    }
  ];
  
  const authInstructions = `
// Using fetch API
const response = await fetch('https://api.opendata.africa/datasets', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();

// Using axios
import axios from 'axios';

const response = await axios.get('https://api.opendata.africa/datasets', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = response.data;
  `;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="bg-muted/30 py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Developer Resources
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                API Documentation
              </h1>
              <p className="text-foreground/70 mb-6">
                Access our datasets programmatically with our simple REST API.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="default">
                  <Code className="mr-2 h-4 w-4" />
                  Get API Key
                </Button>
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Advanced Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* API Documentation */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* Base URL */}
              <div className="mb-10">
                <h2 className="text-xl font-medium mb-4">Base URL</h2>
                <div className="glass-light rounded-lg p-4 flex items-center justify-between">
                  <code className="text-sm">https://api.opendata.africa</code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard('https://api.opendata.africa')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Authentication */}
              <div className="mb-10">
                <h2 className="text-xl font-medium mb-4">Authentication</h2>
                <div className="glass border border-border/50 rounded-lg p-6 mb-4">
                  <p className="text-foreground/70 mb-4">
                    All API requests require authentication using an API key. Include your API key in the request headers.
                  </p>
                  <div className="glass-light rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-medium">Authorization: Bearer YOUR_API_KEY</code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="glass-light rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        <code>{authInstructions}</code>
                      </pre>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex-shrink-0 ml-2"
                        onClick={() => copyToClipboard(authInstructions)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Endpoints */}
              <div>
                <h2 className="text-xl font-medium mb-4">Endpoints</h2>
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="glass border border-border/50 rounded-lg p-6 mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' : 
                        endpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 
                        endpoint.method === 'PUT' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {endpoint.method}
                      </span>
                      <h3 className="text-lg font-medium">{endpoint.name}</h3>
                    </div>
                    
                    <p className="text-foreground/70 mb-4">{endpoint.description}</p>
                    
                    <div className="glass-light rounded-lg p-4 flex items-center justify-between mb-4">
                      <code className="text-sm">{endpoint.path}</code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.path)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {endpoint.params.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                        <div className="glass-light rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="py-2 px-4 text-left font-medium">Parameter</th>
                                <th className="py-2 px-4 text-left font-medium">Type</th>
                                <th className="py-2 px-4 text-left font-medium">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.params.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-t border-border/50">
                                  <td className="py-2 px-4 font-mono">{param.name}</td>
                                  <td className="py-2 px-4">{param.type}</td>
                                  <td className="py-2 px-4">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {endpoint.body && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Request Body ({endpoint.body.type})</h4>
                        <div className="glass-light rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="py-2 px-4 text-left font-medium">Field</th>
                                <th className="py-2 px-4 text-left font-medium">Type</th>
                                <th className="py-2 px-4 text-left font-medium">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.body.fields.map((field, fieldIndex) => (
                                <tr key={fieldIndex} className="border-t border-border/50">
                                  <td className="py-2 px-4 font-mono">{field.name}</td>
                                  <td className="py-2 px-4">{field.type}</td>
                                  <td className="py-2 px-4">{field.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Response ({endpoint.response.type})</h4>
                      <div className="glass-light rounded-lg p-4 max-h-80 overflow-auto">
                        <div className="flex items-start justify-between">
                          <pre className="text-xs whitespace-pre">
                            <code>{endpoint.response.example}</code>
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex-shrink-0 ml-2"
                            onClick={() => copyToClipboard(endpoint.response.example)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Rate Limiting */}
              <div className="glass border border-border/50 rounded-lg p-6 mb-10">
                <h2 className="text-xl font-medium mb-4">Rate Limiting</h2>
                <p className="text-foreground/70 mb-4">
                  API requests are limited to ensure fair usage. Rate limits vary based on your subscription tier.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-light rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium mb-1">Free</h3>
                    <p className="text-2xl font-medium text-primary mb-1">100</p>
                    <p className="text-xs text-foreground/60">requests per day</p>
                  </div>
                  <div className="glass-light rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium mb-1">Basic</h3>
                    <p className="text-2xl font-medium text-primary mb-1">1,000</p>
                    <p className="text-xs text-foreground/60">requests per day</p>
                  </div>
                  <div className="glass-light rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium mb-1">Premium</h3>
                    <p className="text-2xl font-medium text-primary mb-1">10,000</p>
                    <p className="text-xs text-foreground/60">requests per day</p>
                  </div>
                </div>
              </div>
              
              {/* Error Codes */}
              <div className="glass border border-border/50 rounded-lg p-6">
                <h2 className="text-xl font-medium mb-4">Error Codes</h2>
                <div className="glass-light rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="py-2 px-4 text-left font-medium">Status Code</th>
                        <th className="py-2 px-4 text-left font-medium">Error Type</th>
                        <th className="py-2 px-4 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { code: '400', type: 'Bad Request', description: 'The request was malformed or missing required parameters.' },
                        { code: '401', type: 'Unauthorized', description: 'Authentication failed. Check your API key.' },
                        { code: '403', type: 'Forbidden', description: 'You do not have permission to access this resource.' },
                        { code: '404', type: 'Not Found', description: 'The requested resource was not found.' },
                        { code: '429', type: 'Too Many Requests', description: 'You have exceeded your rate limit.' },
                        { code: '500', type: 'Server Error', description: 'An unexpected error occurred on the server.' }
                      ].map((error, errorIndex) => (
                        <tr key={errorIndex} className="border-t border-border/50">
                          <td className="py-2 px-4 font-mono">{error.code}</td>
                          <td className="py-2 px-4">{error.type}</td>
                          <td className="py-2 px-4">{error.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default Api;
