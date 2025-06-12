
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { InferredSchema } from '@/services/processing/schemaInferenceEngine';
import { SemanticAnalysis } from '@/services/processing/semanticAnalyzer';

interface SchemaVisualizationProps {
  schema: InferredSchema;
  semantics: SemanticAnalysis;
}

const SchemaVisualization: React.FC<SchemaVisualizationProps> = ({ schema, semantics }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dimension': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'metric': return 'bg-green-100 text-green-800 border-green-200';
      case 'identifier': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'descriptor': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'numeric': return '🔢';
      case 'temporal': return '📅';
      case 'geographic': return '🌍';
      case 'categorical': return '📊';
      case 'boolean': return '✓';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{schema.entityType}</div>
            <div className="text-sm text-muted-foreground">
              Domain: {semantics.domainClassification}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Schema Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(schema.confidence * 100).toFixed(1)}%</div>
            <Progress value={schema.confidence * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semantics.dataQualityScore.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Completeness: {semantics.completenessScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Links</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schema.fields.map((field, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getDataTypeIcon(field.dataType)}</span>
                        <span className="font-medium">{field.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getRoleColor(field.role)}>
                          {field.role}
                        </Badge>
                        <Badge variant="outline">
                          {field.dataType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Semantic Type</div>
                        <div className="font-medium">{field.semanticType}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cardinality</div>
                        <div className="font-medium">{field.metadata.cardinality.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Confidence</div>
                        <div className="font-medium">{(field.confidence * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Unique</div>
                        <div className="font-medium">{field.metadata.isUnique ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    {field.examples.length > 0 && (
                      <div className="mt-3">
                        <div className="text-muted-foreground text-sm mb-1">Examples</div>
                        <div className="text-sm bg-muted rounded p-2">
                          {field.examples.slice(0, 3).map(String).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              {schema.relationships.length > 0 ? (
                <div className="space-y-3">
                  {schema.relationships.map((rel, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {rel.sourceField} ↔ {rel.targetField}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {rel.relationshipType} relationship
                          </div>
                        </div>
                        <Badge variant="outline">
                          Strength: {(rel.strength * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No significant relationships detected
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Knowledge Links</CardTitle>
            </CardHeader>
            <CardContent>
              {semantics.knowledgeLinks.length > 0 ? (
                <div className="space-y-3">
                  {semantics.knowledgeLinks.map((link, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{link.field}</div>
                        <Badge variant="outline">
                          {(link.confidence * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Source</div>
                        <div className="font-medium">{link.externalSource}</div>
                      </div>
                      <div className="text-sm mt-2 text-muted-foreground">
                        {link.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No external knowledge sources identified
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {semantics.suggestedAnalyses.map((analysis, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="font-medium mb-1">{analysis}</div>
                    <div className="text-sm text-muted-foreground">
                      Recommended for {semantics.domainClassification} domain
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaVisualization;
