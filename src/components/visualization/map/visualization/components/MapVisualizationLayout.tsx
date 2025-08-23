
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import MapContainerComponent from '../../MapContainer';
import MapControls from '../../MapControls';
import MapSidebar from '../MapSidebar';
import { MapVisualizationLayoutProps } from '../types';

const MapVisualizationLayout: React.FC<MapVisualizationLayoutProps> = ({
  sidebarCollapsed,
  visualizationType,
  handleVisualizationTypeChange,
  geoJSON,
  points,
  defaultCenter,
  defaultZoom,
  category,
  timeIndex,
  activeLayers,
  setActiveLayers,
  anomalyDetection,
  anomalyThreshold,
  toggleSidebar,
  sidebarProps
}) => {
  return (
    <div className="flex gap-6">
      {/* Map Container */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4'}`}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Map Controls */}
            <div className="p-4 border-b bg-muted/20">
              <MapControls
                currentType={visualizationType}
                setType={handleVisualizationTypeChange}
                hasGeoJSON={!!geoJSON}
                hasPoints={points.length > 0}
              />
            </div>
            
            {/* Map Display */}
            <div className="relative h-[500px]">
              <MapContainerComponent 
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                geoJSON={geoJSON}
                points={points}
                visualizationType={visualizationType}
                category={category}
                currentTimeIndex={timeIndex}
                activeLayers={activeLayers}
                anomalyDetection={anomalyDetection}
                anomalyThreshold={anomalyThreshold}
              />
            </div>
            
            {/* Layer Controls */}
            <div className="p-4 border-t bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeLayers.includes('labels')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActiveLayers([...activeLayers, 'labels']);
                        } else {
                          setActiveLayers(activeLayers.filter(layer => layer !== 'labels'));
                        }
                      }}
                      className="rounded"
                    />
                    Show Labels
                  </label>
                </div>
                
                <button
                  onClick={toggleSidebar}
                  className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
                >
                  {sidebarCollapsed ? 'Show Controls' : 'Hide Controls'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sidebar Controls */}
      {!sidebarCollapsed && (
        <div className="w-1/4 hidden lg:block">
          <MapSidebar {...sidebarProps} />
        </div>
      )}
    </div>
  );
};

export default MapVisualizationLayout;
