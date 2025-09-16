
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { studyPlanItems as defaultStudyPlanItems, StudyPlanItem } from "@/lib/placeholder-data";

interface StudyPlanContextType {
  plan: StudyPlanItem[];
  setPlan: (plan: StudyPlanItem[]) => void;
  updateTopicStatus: (topicId: number, status: StudyPlanItem['status']) => void;
  addTopics: (topics: StudyPlanItem[]) => void;
  removeTopic: (topicId: number) => void;
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined);

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<StudyPlanItem[]>(defaultStudyPlanItems);

  const updateTopicStatus = (topicId: number, status: StudyPlanItem['status']) => {
    setPlan(prevPlan => 
      prevPlan.map(item => 
        item.id === topicId ? { ...item, status } : item
      )
    );
  };
  
  const addTopics = (topics: StudyPlanItem[]) => {
    setPlan(prevPlan => {
      const existingIds = new Set(prevPlan.map(item => item.id));
      let maxId = prevPlan.length > 0 ? Math.max(...prevPlan.map(item => item.id)) : 0;
      
      const newTopics = topics.map(topic => {
        // This is a simplistic way to handle IDs. A robust solution would use UUIDs.
        if (existingIds.has(topic.id)) {
            maxId++;
            return { ...topic, id: maxId };
        }
        maxId = Math.max(maxId, topic.id);
        return topic;
      });

      return [...prevPlan, ...newTopics];
    });
  }

  const removeTopic = (topicId: number) => {
    setPlan(prevPlan => prevPlan.filter(item => item.id !== topicId));
  }

  const value = {
    plan,
    setPlan,
    updateTopicStatus,
    addTopics,
    removeTopic
  };

  return (
    <StudyPlanContext.Provider value={value}>
      {children}
    </StudyPlanContext.Provider>
  );
}

export function useStudyPlan() {
  const context = useContext(StudyPlanContext);
  if (context === undefined) {
    throw new Error("useStudyPlan must be used within a StudyPlanProvider");
  }
  return context;
}
