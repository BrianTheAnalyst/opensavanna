
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type VerificationTabValue = 'pending' | 'approved' | 'rejected';

interface VerificationTabsProps {
  activeTab: VerificationTabValue;
  setActiveTab: (value: VerificationTabValue) => void;
}

const VerificationTabs = ({ activeTab, setActiveTab }: VerificationTabsProps) => {
  const handleValueChange = (value: string) => {
    // Ensure the value is one of our allowed values
    if (value === 'pending' || value === 'approved' || value === 'rejected') {
      setActiveTab(value);
    }
  };

  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab} 
      onValueChange={handleValueChange} 
      className="mb-6"
    >
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default VerificationTabs;
