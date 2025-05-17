
import { toast } from "sonner";
import { MapPoint } from "@/components/visualization/map/types";

/**
 * Calculate spatial correlation between two variables
 * 
 * @param points Array of map points containing the variables
 * @param var1Key First variable key in the point data
 * @param var2Key Second variable key in the point data
 * @returns Correlation coefficient between -1 and 1
 */
export const calculateSpatialCorrelation = async (
  points: MapPoint[],
  var1Key: string,
  var2Key: string
): Promise<number> => {
  try {
    if (!points || points.length === 0) {
      throw new Error("No data points available");
    }

    // Extract the values for both variables
    const values = points.filter(point => 
      point.properties && 
      typeof point.properties[var1Key] === 'number' && 
      typeof point.properties[var2Key] === 'number'
    ).map(point => ({
      var1: point.properties?.[var1Key] as number,
      var2: point.properties?.[var2Key] as number
    }));

    if (values.length < 2) {
      throw new Error("Insufficient data points with both variables");
    }

    // Calculate means
    const mean1 = values.reduce((sum, p) => sum + p.var1, 0) / values.length;
    const mean2 = values.reduce((sum, p) => sum + p.var2, 0) / values.length;

    // Calculate correlation coefficient
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (const value of values) {
      const dev1 = value.var1 - mean1;
      const dev2 = value.var2 - mean2;
      numerator += dev1 * dev2;
      denom1 += dev1 * dev1;
      denom2 += dev2 * dev2;
    }

    if (denom1 === 0 || denom2 === 0) {
      return 0; // No variation in at least one of the variables
    }

    const correlation = numerator / (Math.sqrt(denom1) * Math.sqrt(denom2));
    return parseFloat(correlation.toFixed(2));
  } catch (error) {
    console.error("Error calculating spatial correlation:", error);
    toast.error("Failed to calculate correlation");
    return 0;
  }
};

/**
 * Find geographic clusters of points based on their properties
 * 
 * @param points Array of map points to be analyzed
 * @param propertyKey The property to use for clustering
 * @param clusterThreshold Distance threshold for clustering
 * @returns Array of map points with cluster information added
 */
export const findGeographicClusters = async (
  points: MapPoint[],
  propertyKey: string,
  clusterThreshold: number = 50 // in kilometers
): Promise<MapPoint[]> => {
  try {
    if (!points || points.length === 0) {
      return points;
    }

    // Calculate distance between two points (in kilometers)
    const calculateDistance = (p1: MapPoint, p2: MapPoint): number => {
      const R = 6371; // Earth's radius in km
      const lat1 = p1.lat * Math.PI/180;
      const lat2 = p2.lat * Math.PI/180;
      const dLat = (p2.lat - p1.lat) * Math.PI/180;
      const dLon = (p2.lng - p1.lng) * Math.PI/180;

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Simple clustering algorithm based on distance
    let clusterIndex = 0;
    const clusteredPoints = [...points];
    
    // Initialize all points as unassigned
    clusteredPoints.forEach(p => {
      p.cluster = -1;
    });

    // Assign clusters
    for (let i = 0; i < clusteredPoints.length; i++) {
      if (clusteredPoints[i].cluster !== -1) continue;
      
      clusteredPoints[i].cluster = clusterIndex;
      
      // Check other points to add to this cluster
      for (let j = 0; j < clusteredPoints.length; j++) {
        if (i === j || clusteredPoints[j].cluster !== -1) continue;
        
        const distance = calculateDistance(clusteredPoints[i], clusteredPoints[j]);
        if (distance <= clusterThreshold) {
          clusteredPoints[j].cluster = clusterIndex;
        }
      }
      
      clusterIndex++;
    }
    
    return clusteredPoints;
  } catch (error) {
    console.error("Error finding geographic clusters:", error);
    toast.error("Failed to identify clusters");
    return points;
  }
};

/**
 * Identify spatial outliers using Local Moran's I
 * 
 * @param points Array of map points to analyze
 * @param propertyKey The property to analyze for outliers
 * @returns Array of map points with outlier information
 */
export const identifySpatialOutliers = async (
  points: MapPoint[],
  propertyKey: string
): Promise<MapPoint[]> => {
  try {
    if (!points || points.length < 5) {
      return points;
    }
    
    // For simplicity, we're just implementing a basic approach
    // In a real implementation, this would use a proper Local Moran's I calculation
    
    // Calculate mean and std dev
    const values = points
      .filter(p => p.properties && typeof p.properties[propertyKey] === 'number')
      .map(p => p.properties?.[propertyKey] as number);
    
    if (values.length < 5) return points;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );
    
    // Mark outliers (simple z-score approach for demo)
    const threshold = 2.0; // z-score threshold
    
    return points.map(point => {
      const value = point.properties?.[propertyKey] as number;
      if (typeof value === 'number') {
        const zScore = (value - mean) / stdDev;
        return {
          ...point,
          isSpatialOutlier: Math.abs(zScore) > threshold,
          outlierScore: zScore
        };
      }
      return point;
    });
    
  } catch (error) {
    console.error("Error identifying spatial outliers:", error);
    toast.error("Failed to identify spatial outliers");
    return points;
  }
};
