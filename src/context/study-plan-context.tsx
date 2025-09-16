
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { studyPlanItems as defaultStudyPlanItems, StudyPlanItem } from "@/lib/placeholder-data";

interface StudyPlanContextType {
  plan: StudyPlanItem[];
  setPlan: (plan: StudyPlanItem[]) => void;
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined);

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<StudyPlanItem[]>(defaultStudyPlanItems);

  const value = {
    plan,
    setPlan,
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
