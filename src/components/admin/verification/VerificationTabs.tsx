
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VerificationTabsProps {
  activeTab: 'pending' | 'approved' | 'rejected';
  setActiveTab: (value: 'pending' | 'approved' | 'rejected') => void;
}

const VerificationTabs = ({ activeTab, setActiveTab }: VerificationTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'approved' | 'rejected')} className="mb-6">
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default VerificationTabs;
