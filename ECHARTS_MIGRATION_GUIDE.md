# 🎨 ECharts Migration Complete - Quick Start Guide

## ✅ What's New

### 1. **Apache ECharts Integration**
- Replaced basic Recharts with powerful ECharts library
- 12+ chart types now available (was 5)
- Beautiful animations and interactions
- Better performance for large datasets
- Mobile-optimized touch interactions

### 2. **Cross-Filtering System**
- Click any chart element to filter other charts
- Filter pills UI shows active filters
- Clear individual or all filters
- Filters work across all visualizations

### 3. **Rich Interactive Tooltips**
- Multi-line tooltips with formatted values
- Change indicators (up/down arrows)
- Mini trend charts in tooltips
- Action buttons (drill-down, filter)
- Additional metadata display

---

## 🚀 How to Use

### Basic Usage

All existing charts work automatically! No changes needed for basic functionality.

```tsx
import InsightCard from '@/components/InsightCard';

// This still works exactly the same!
<InsightCard
  title="Sales Data"
  description="Monthly sales"
  data={salesData}
  type="bar"
  dataKey="value"
  nameKey="name"
/>
```

### New Chart Types

Now you can use additional chart types:

```tsx
import EnhancedInsightCard from '@/components/visualization/echarts/EnhancedInsightCard';

// Funnel Chart
<EnhancedInsightCard
  title="Conversion Funnel"
  data={funnelData}
  type="funnel"
  dataKey="value"
  nameKey="name"
/>

// Gauge Chart
<EnhancedInsightCard
  title="Performance Score"
  data={scoreData}
  type="gauge"
  dataKey="value"
  nameKey="name"
/>

// Scatter Plot
<EnhancedInsightCard
  title="Correlation Analysis"
  data={correlationData}
  type="scatter"
  dataKey="y"
  nameKey="x"
/>

// Radar Chart
<EnhancedInsightCard
  title="Multi-Metric Comparison"
  data={radarData}
  type="radar"
  dataKey="value"
  nameKey="name"
/>
```

### Available Chart Types

| Type | Use Case |
|------|----------|
| `bar` | Compare categories |
| `line` | Show trends over time |
| `area` | Emphasize magnitude changes |
| `pie` | Show proportions |
| `scatter` | Show relationships |
| `radar` | Multi-dimensional comparison |
| `funnel` | Conversion stages |
| `gauge` | Single value display |
| `heatmap` | Data density |
| `treemap` | Hierarchical data |
| `sankey` | Flow between nodes |
| `boxplot` | Statistical distribution |

### Cross-Filtering

Cross-filtering is enabled by default. Click any chart element to filter other charts.

```tsx
// Enable cross-filtering (default)
<EnhancedInsightCard
  title="Sales by Region"
  data={regionData}
  type="bar"
  enableCrossFilter={true}  // This is the default
/>

// Disable cross-filtering for specific charts
<EnhancedInsightCard
  title="Reference Chart"
  data={refData}
  type="line"
  enableCrossFilter={false}  // Won't participate in filtering
/>
```

### Custom Drill-Down

Add custom drill-down behavior:

```tsx
const handleDrillDown = (params: any) => {
  console.log('Drill down to:', params.name);
  // Navigate to detail page
  navigate(`/details/${params.name}`);
};

<EnhancedInsightCard
  title="Regional Sales"
  data={regionData}
  type="bar"
  onDrillDown={handleDrillDown}
/>
```

### Advanced Configuration

Customize chart appearance and behavior:

```tsx
<EnhancedInsightCard
  title="Advanced Chart"
  data={data}
  type="line"
  config={{
    title: "Main Title",
    subtitle: "Subtitle here",
    xAxisLabel: "Time Period",
    yAxisLabel: "Revenue ($)",
    showLegend: true,
    showGrid: true,
    smooth: true,
    toolbox: true,  // Show save, zoom, restore buttons
    zoom: true,     // Enable data zoom
    animation: true,
  }}
/>
```

---

## 🎯 Migration Notes

### Automatic Compatibility

All existing `InsightCard` components work automatically. The component has been updated to use ECharts internally while maintaining the same props interface.

### What Changed

1. **InsightCard.tsx** - Now uses `EnhancedInsightCard` internally
2. **Design System** - ECharts theme automatically matches your design tokens
3. **Performance** - Charts now render faster with large datasets
4. **Interactivity** - Click events, hover effects, and animations are smoother

### What Stayed the Same

- All existing props (`title`, `description`, `data`, `type`, `dataKey`, `nameKey`)
- Data format requirements
- Component API
- Error handling

---

## 📊 Filter System

### How Filtering Works

1. **Click Event** - Click any chart element (bar, line point, pie slice)
2. **Filter Created** - A filter is created based on the clicked value
3. **Filter Applied** - All other charts re-render with filtered data
4. **Filter Pills** - Active filters shown as removable pills
5. **Clear Filters** - Click X on pill or "Clear All" button

### Filter Pills Component

Already integrated in `VisualizationContainer`. Shows up automatically when filters are active.

```tsx
import { FilterPills } from '@/components/visualization/FilterPills';

// Already included in VisualizationContainer
// But you can use it standalone:
<FilterPills />
```

### Programmatic Filtering

Access filter context directly:

```tsx
import { useDashboardFilters } from '@/contexts/DashboardFilterContext';

const MyComponent = () => {
  const { filters, addFilter, removeFilter, clearFilters } = useDashboardFilters();

  const handleCustomFilter = () => {
    addFilter({
      id: 'custom-1',
      field: 'category',
      operator: 'equals',
      value: 'Electronics',
      label: 'Category: Electronics',
    });
  };

  return (
    <div>
      <p>Active Filters: {filters.length}</p>
      <button onClick={handleCustomFilter}>Apply Custom Filter</button>
      <button onClick={clearFilters}>Clear All</button>
    </div>
  );
};
```

---

## 🎨 Rich Tooltips

### Default Tooltips

All charts now have rich tooltips automatically. They show:
- Primary value (formatted)
- Change indicators (if data includes change)
- Category/label
- Additional metadata

### Custom Tooltip Data

Pass additional data for richer tooltips:

```tsx
const enrichedData = salesData.map(item => ({
  ...item,
  change: item.growthRate,  // Will show as % change
  trend: item.last7Days,    // Will show mini sparkline
  additionalData: {
    region: item.region,
    manager: item.manager,
  }
}));

<EnhancedInsightCard
  title="Sales Performance"
  data={enrichedData}
  type="bar"
/>
```

---

## 🔧 Troubleshooting

### Charts Not Displaying

1. Check data format: `[{ name: 'Label', value: 123 }, ...]`
2. Ensure `nameKey` and `dataKey` match your data fields
3. Check browser console for errors

### Filters Not Working

1. Verify `DashboardFilterProvider` wraps your app (already in `App.tsx`)
2. Check `enableCrossFilter={true}` on charts
3. Ensure data has consistent field names

### Theme Not Matching

ECharts theme automatically reads CSS variables. If colors look wrong:
1. Check `index.css` for proper HSL color definitions
2. Clear browser cache
3. Verify `--chart-1` through `--chart-5` are defined

### Performance Issues

For very large datasets (>1000 points):
1. Enable data sampling in config
2. Use `dataZoom` for interactive zooming
3. Consider aggregating data before rendering

---

## 📚 Examples

### Complete Dashboard Example

```tsx
import { DashboardFilterProvider } from '@/contexts/DashboardFilterContext';
import { FilterPills } from '@/components/visualization/FilterPills';
import EnhancedInsightCard from '@/components/visualization/echarts/EnhancedInsightCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1>Sales Dashboard</h1>
      
      {/* Filter Pills */}
      <FilterPills />
      
      {/* Charts with cross-filtering */}
      <div className="grid grid-cols-2 gap-4">
        <EnhancedInsightCard
          title="Sales by Region"
          data={regionData}
          type="bar"
          enableCrossFilter={true}
        />
        
        <EnhancedInsightCard
          title="Revenue Trend"
          data={trendData}
          type="line"
          config={{ smooth: true }}
          enableCrossFilter={true}
        />
        
        <EnhancedInsightCard
          title="Product Mix"
          data={productData}
          type="pie"
          enableCrossFilter={true}
        />
        
        <EnhancedInsightCard
          title="Conversion Funnel"
          data={funnelData}
          type="funnel"
          enableCrossFilter={true}
        />
      </div>
    </div>
  );
};
```

### Chart Showcase

See all available chart types:

```tsx
import { ChartShowcase } from '@/components/visualization/echarts/ChartShowcase';

// Show all chart types
<ChartShowcase />

// Show specific chart type
<ChartShowcase type="funnel" />
```

---

## 🎉 What's Next

The foundation is now in place for advanced features:

- **Dashboard Builder** - Drag-and-drop chart placement (coming soon)
- **SQL Editor** - Custom query interface (coming soon)
- **Advanced Analytics** - Forecasting, anomaly detection (coming soon)
- **Export Features** - PDF, Excel, PNG export (coming soon)

---

## 💡 Tips

1. **Start Simple** - Use default settings first, customize later
2. **Use Cross-Filtering** - It's the killer feature, users love it
3. **Rich Tooltips** - Add `change` and `trend` data for maximum impact
4. **Chart Types** - Pick the right chart for your data story
5. **Performance** - Keep datasets under 500 points for smooth interactions

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review the console for errors
3. Verify data format matches examples
4. Check that `DashboardFilterProvider` is in your component tree

Happy visualizing! 🎨📊
