
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntities } from '@/services/entityService';
import { Entity, EntityType } from '@/types/entity';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Globe,
  Building2,
  BookOpen,
  Calendar,
  User,
  Tag,
  Loader2,
  Search,
  Plus,
  Filter,
  ArrowRight,
} from 'lucide-react';

const EntitiesExplorer = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<EntityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const entityTypes: Array<{ value: EntityType | 'all', label: string, icon: React.ReactNode }> = [
    { value: 'all', label: 'All Types', icon: <Tag className="h-4 w-4" /> },
    { value: 'Place', label: 'Places', icon: <Globe className="h-4 w-4" /> },
    { value: 'Organization', label: 'Organizations', icon: <Building2 className="h-4 w-4" /> },
    { value: 'Topic', label: 'Topics', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'Event', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { value: 'Person', label: 'People', icon: <User className="h-4 w-4" /> },
    { value: 'Concept', label: 'Concepts', icon: <Tag className="h-4 w-4" /> },
  ];
  
  useEffect(() => {
    const fetchEntities = async () => {
      setIsLoading(true);
      try {
        // For the initial load, get all entities
        const data = await getEntities();
        setEntities(data);
        setFilteredEntities(data);
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntities();
  }, []);
  
  // Apply filters when type or search query changes
  useEffect(() => {
    let filtered = [...entities];
    
    // Apply type filter
    if (activeType !== 'all') {
      filtered = filtered.filter(entity => entity.type === activeType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entity => 
        entity.name.toLowerCase().includes(query) || 
        entity.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredEntities(filtered);
  }, [activeType, searchQuery, entities]);
  
  const handleTypeChange = (value: string) => {
    setActiveType(value as EntityType | 'all');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Get the icon for an entity type
  const getEntityIcon = (type: string, size: number = 5) => {
    switch (type) {
      case 'Place':
        return <Globe className={`h-${size} w-${size}`} />;
      case 'Organization':
        return <Building2 className={`h-${size} w-${size}`} />;
      case 'Topic':
        return <BookOpen className={`h-${size} w-${size}`} />;
      case 'Event':
        return <Calendar className={`h-${size} w-${size}`} />;
      case 'Person':
        return <User className={`h-${size} w-${size}`} />;
      default:
        return <Tag className={`h-${size} w-${size}`} />;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Place': return 'text-green-500 bg-green-500/10';
      case 'Organization': return 'text-blue-500 bg-blue-500/10';
      case 'Topic': return 'text-purple-500 bg-purple-500/10';
      case 'Event': return 'text-yellow-500 bg-yellow-500/10';
      case 'Person': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 mx-auto py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Knowledge Graph
                </div>
                <h1 className="text-3xl font-medium">Entities Explorer</h1>
                <p className="text-foreground/70 max-w-2xl mt-2">
                  Browse, search, and explore entities in the knowledge graph to discover relationships and connected datasets.
                </p>
              </div>
              
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Entity
              </Button>
            </div>
          </div>
          
          {/* Search and filter bar */}
          <div className="glass border border-border/50 rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {entityTypes.map((type) => (
                      <DropdownMenuItem
                        key={type.value}
                        onClick={() => setActiveType(type.value)}
                        className={activeType === type.value ? "bg-secondary" : ""}
                      >
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <Tabs defaultValue="all" onValueChange={handleTypeChange} className="mb-8">
            <TabsList className="mb-6 glass w-full justify-start overflow-x-auto">
              {entityTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="flex items-center">
                  {type.icon}
                  <span className="ml-2">{type.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeType} className="animate-slide-up">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
              ) : filteredEntities.length === 0 ? (
                <div className="glass border border-border/50 rounded-xl p-8 text-center">
                  <Tag className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No entities found</h3>
                  <p className="text-muted-foreground mb-4">
                    No entities match your current search or filter criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setActiveType('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEntities.map((entity) => (
                    <Link
                      to={`/entities/${entity.id}`}
                      key={entity.id}
                      className="glass border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(entity.type)}`}>
                          {getEntityIcon(entity.type, 5)}
                        </div>
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {entity.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mb-1 line-clamp-1">
                        {entity.name}
                      </h3>
                      <p className="text-foreground/70 text-sm mb-3 line-clamp-2">
                        {entity.description || `A ${entity.type.toLowerCase()} entity in the knowledge graph.`}
                      </p>
                      <div className="flex items-center text-primary text-sm mt-auto">
                        <span>View Details</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EntitiesExplorer;
