
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DatasetAnalyticsProps {
  processedFileData?: any;
}

const DatasetAnalytics: React.FC<DatasetAnalyticsProps> = ({ processedFileData }) => {
  if (!processedFileData || !processedFileData.summary) {
    return null;
  }

  const summary = processedFileData.summary;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Dataset Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            {Object.keys(summary.numeric_fields || {}).length > 0 && (
              <TabsTrigger value="numeric">Numeric Data</TabsTrigger>
            )}
            {Object.keys(summary.categorical_fields || {}).length > 0 && (
              <TabsTrigger value="categorical">Categorical Data</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-3">
              <div className="glass border border-border/50 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Dataset Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Row Count</div>
                    <div className="font-medium">{summary.row_count || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Field Count</div>
                    <div className="font-medium">{summary.fields?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Data Types</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {Object.keys(summary.field_types || {}).length > 0 ? (
                        [...new Set(Object.values(summary.field_types))].map((type, i) => (
                          <Badge key={i} variant="outline">{String(type)}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No data types detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fields">
            <div className="glass border border-border/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Field Information</h3>
              <div className="space-y-2">
                {summary.fields?.map((field: string) => (
                  <div key={field} className="flex justify-between items-center py-2 border-b border-border/30">
                    <div>
                      <div className="font-medium">{field}</div>
                      <div className="text-xs text-muted-foreground">
                        Type: {summary.field_types?.[field] || 'unknown'}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {summary.numeric_fields?.[field] ? 'Numeric' : 
                       summary.categorical_fields?.[field] ? 'Categorical' : 'Other'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {Object.keys(summary.numeric_fields || {}).length > 0 && (
            <TabsContent value="numeric">
              <div className="glass border border-border/50 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Numeric Fields</h3>
                <div className="space-y-4">
                  {Object.entries(summary.numeric_fields || {}).map(([field, stats]: [string, any]) => (
                    <div key={field} className="pb-3 border-b border-border/30">
                      <div className="font-medium mb-2">{field}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Min</div>
                          <div>{stats.min}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Max</div>
                          <div>{stats.max}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Average</div>
                          <div>{stats.mean.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Median</div>
                          <div>{stats.median.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {stats.has_negative && <Badge variant="outline">Has negative values</Badge>}
                        {stats.has_decimal && <Badge variant="outline">Has decimal values</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
          
          {Object.keys(summary.categorical_fields || {}).length > 0 && (
            <TabsContent value="categorical">
              <div className="glass border border-border/50 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Categorical Fields</h3>
                <div className="space-y-4">
                  {Object.entries(summary.categorical_fields || {}).map(([field, stats]: [string, any]) => (
                    <div key={field} className="pb-3 border-b border-border/30">
                      <div className="font-medium mb-2">{field}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Unique Values</div>
                          <div>{stats.unique_count}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Most Common</div>
                          <div>{stats.most_common?.value} ({stats.most_common?.count} times)</div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {stats.is_date && <Badge variant="outline">Date format</Badge>}
                      </div>
                      
                      {stats.distribution && Object.keys(stats.distribution).length <= 10 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">Value Distribution</div>
                          <div className="text-xs space-y-1">
                            {Object.entries(stats.distribution).map(([val, count]: [string, any]) => (
                              <div key={val} className="flex justify-between">
                                <span className="truncate max-w-[70%]">{val}</span>
                                <span>{count} ({((count/summary.row_count)*100).toFixed(1)}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatasetAnalytics;
