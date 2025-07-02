
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MapContainerComponent from './MapContainer';
import { MapContainerProps } from './types';

interface EnhancedMapVisualizationProps extends MapContainerProps {
  title?: string;
  demographicData?: Array<{ name: string; value: number; color: string }>;
  ageDistributionData?: Array<{ name: string; value: number }>;
  retailDistributionData?: Array<{ name: string; value: number }>;
}

const EnhancedMapVisualization: React.FC<EnhancedMapVisualizationProps> = ({
  title = "Geographic Data Visualization",
  demographicData = [
    { name: 'Female', value: 49.1, color: '#00C49F' },
    { name: 'Male', value: 50.9, color: '#8DD1E1' }
  ],
  ageDistributionData = [
    { name: '0-14yrs', value: 35 },
    { name: '15-34yrs', value: 50 },
    { name: '35-64yrs', value: 15 },
    { name: '65+', value: 5 }
  ],
  retailDistributionData = [
    { name: 'bar_restaurant', value: 150 },
    { name: 'supermarket', value: 300 },
    { name: 'roadseller', value: 80 },
    { name: 'kiosk_shop', value: 2500 },
    { name: 'wholesaler', value: 120 },
    { name: 'pharmacy_chemist', value: 90 },
    { name: 'wine_spirit', value: 200 }
  ],
  ...mapProps
}) => {
  const COLORS = ['#E8E8E8', '#C4C4C4', '#00C49F', '#8DD1E1', '#FFBB28', '#FF8042'];

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Main Map - Takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <MapContainerComponent {...mapProps} />
            </CardContent>
          </Card>
        </div>

        {/* Side Charts - Takes up 1/3 of the space */}
        <div className="space-y-4 h-full">
          {/* Gender Distribution Pie Chart */}
          <Card className="h-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gender</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%" 
                    innerRadius={25}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={20}
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Age Distribution Bar Chart */}
          <Card className="h-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={ageDistributionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Retail Distribution Bar Chart */}
          <Card className="h-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Retail Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={retailDistributionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 8 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend for Map */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-sm font-medium">Number of Retailers</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-red-600"></div>
                <span className="text-xs">4500 - 6000</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-red-400"></div>
                <span className="text-xs">3000 - 4500</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-red-200"></div>
                <span className="text-xs">1500 - 3000</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200"></div>
                <span className="text-xs">0 - 1500</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMapVisualization;
