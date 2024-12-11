import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabNavigationProps {
  tabs: { label: string; content: string }[];
  style?: React.CSSProperties;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || '');

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label} onClick={() => setActiveTab(tab.label)}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

