
import { useState, useEffect } from 'react';
import { Database, Layers, PieChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HeroStatsProps {
  isLoaded: boolean;
}

const HeroStats = ({ isLoaded }: HeroStatsProps) => {
  const [stats, setStats] = useState({
    datasets: 0,
    categories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get the total number of datasets
        const { count: datasetCount } = await supabase
          .from('datasets')
          .select('*', { count: 'exact', head: true });
        
        // Get the number of unique categories
        const { data: categoryData } = await supabase
          .from('datasets')
          .select('category')
          .distinct();
        
        setStats({
          datasets: datasetCount || 0,
          categories: categoryData?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`mt-12 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-300`}>
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-primary" />
          <span>{stats.datasets.toLocaleString()} Datasets</span>
        </div>
        <div className="flex items-center">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          <span>{stats.categories} Categories</span>
        </div>
        <div className="flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          <span>Interactive Visualizations</span>
        </div>
      </div>
    </div>
  );
};

export default HeroStats;
