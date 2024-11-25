import React from "react";

import { FinantialTracker } from "@/components/finantial-tracker";
import GoalsSection from "./components/goals-section";
import { BudgetOverview } from "./components/budget-overview";
import { FinancialTips } from "./components/financial-tips";

const TrackerPage = () => {
  return (
    <main className="mt-20 flex flex-col gap-4">
      <FinantialTracker>
        <GoalsSection />
      </FinantialTracker>
      <BudgetOverview />
      <FinancialTips />
    </main>
  );
};

export default TrackerPage;
