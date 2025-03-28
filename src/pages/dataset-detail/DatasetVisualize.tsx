
import Visualization from '@/components/Visualization';

const DatasetVisualize = () => {
  return (
    <>
      <div className="glass border border-border/50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Visualize This Dataset</h2>
        <p className="text-foreground/70 mb-6">
          Explore the data through interactive visualizations. Select different views and parameters to discover insights.
        </p>
        
        <Visualization 
          data={[
            { name: 'East Africa', value: 8.2 },
            { name: 'West Africa', value: 6.7 },
            { name: 'North Africa', value: 4.5 },
            { name: 'Southern Africa', value: 3.2 },
            { name: 'Central Africa', value: 5.1 }
          ]} 
          title="GDP Growth by Region (2022)" 
          description="Annual GDP growth percentage by region"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <Visualization 
            data={[
              { name: '2017', value: 3.2 },
              { name: '2018', value: 3.8 },
              { name: '2019', value: 4.1 },
              { name: '2020', value: -1.8 },
              { name: '2021', value: 4.5 },
              { name: '2022', value: 5.6 },
              { name: '2023', value: 4.9 }
            ]} 
            title="GDP Growth Trend (2017-2023)" 
            description="Annual GDP growth percentage over time"
          />
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <Visualization 
            data={[
              { name: 'East Africa', value: 6.8 },
              { name: 'West Africa', value: 9.2 },
              { name: 'North Africa', value: 7.5 },
              { name: 'Southern Africa', value: 5.3 },
              { name: 'Central Africa', value: 8.1 }
            ]} 
            title="Inflation Rates by Region (2022)" 
            description="Annual inflation percentage by region"
          />
        </div>
      </div>
      
      <div className="mt-6 p-6 bg-muted/30 rounded-xl">
        <h3 className="text-lg font-medium mb-3">Visualization Notes</h3>
        <p className="text-foreground/70">
          These visualizations are generated using the dataset and are for illustration purposes. For more advanced visualizations or to create custom charts, download the dataset and use your preferred data analysis tools. You can also access our API to integrate this data into your own applications.
        </p>
      </div>
    </>
  );
};

export default DatasetVisualize;
