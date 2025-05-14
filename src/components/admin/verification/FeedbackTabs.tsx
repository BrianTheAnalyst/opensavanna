
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DatasetWithEmail } from '@/types/dataset';

interface FeedbackTabsProps {
  dataset: DatasetWithEmail;
  feedbackTab: 'notes' | 'email';
  setFeedbackTab: (tab: 'notes' | 'email') => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const FeedbackTabs: React.FC<FeedbackTabsProps> = ({
  dataset,
  feedbackTab,
  setFeedbackTab,
  notes,
  setNotes
}) => {
  return (
    <Tabs value={feedbackTab} onValueChange={(v) => setFeedbackTab(v as 'notes' | 'email')}>
      <TabsList className="mb-2">
        <TabsTrigger value="notes">Add Notes</TabsTrigger>
        <TabsTrigger value="email">Email Contributor</TabsTrigger>
      </TabsList>
      
      <TabsContent value="notes">
        <label className="text-sm text-foreground/70 mb-1 block">
          Add feedback notes to this dataset
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for improvement..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          These notes will be visible to the contributor when they view their dataset.
        </p>
      </TabsContent>
      
      <TabsContent value="email">
        <label className="text-sm text-foreground/70 mb-1 block">
          Send feedback to contributor via email
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write feedback to send to the contributor..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          This message will be sent to {dataset.userEmail || 'the contributor'}
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default FeedbackTabs;
