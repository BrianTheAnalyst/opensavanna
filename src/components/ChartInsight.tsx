
import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle, Award, PieChart } from 'lucide-react';

interface ChartInsightProps {
  type: 'increase' | 'decrease' | 'trend' | 'warning' | 'highlight' | 'comparison';
  title: string;
  value?: string | number;
  description: string;
  percentage?: number;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const ChartInsight = ({ 
  type, 
  title, 
  value, 
  description, 
  percentage, 
  color = 'default' 
}: ChartInsightProps) => {
  const getIcon = () => {
    switch (type) {
      case 'increase':
        return <ArrowUp className="h-5 w-5" />;
      case 'decrease':
        return <ArrowDown className="h-5 w-5" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'highlight':
        return <Award className="h-5 w-5" />;
      case 'comparison':
        return <PieChart className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'bg-green-50 border-green-100 text-green-700';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'danger':
        return 'bg-red-50 border-red-100 text-red-700';
      case 'info':
        return 'bg-blue-50 border-blue-100 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  };

  const getIconColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'danger':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPercentageColorClass = () => {
    if (!percentage) return '';
    
    if (type === 'increase') {
      return percentage > 0 ? 'text-green-600' : 'text-red-600';
    }
    
    if (type === 'decrease') {
      return percentage < 0 ? 'text-green-600' : 'text-red-600';
    }
    
    return '';
  };

  return (
    <div className={`rounded-lg border p-4 ${getColorClass()}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <div className={getIconColorClass()}>{getIcon()}</div>
      </div>
      {value && (
        <p className="mt-2 text-2xl font-bold">{value}</p>
      )}
      <p className="mt-1 text-xs text-gray-600">{description}</p>
      {percentage !== undefined && (
        <div className="mt-2">
          <span className={`text-xs font-medium ${getPercentageColorClass()}`}>
            {percentage > 0 ? '+' : ''}{percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ChartInsight;
