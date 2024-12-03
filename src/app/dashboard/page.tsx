import React from "react";

import { FinantialTracker } from "@/components/finantial-tracker";
import GoalsSection from "./components/goals-section";
import { BudgetOverview } from "./components/budget-overview";
import { FinancialTips } from "./components/financial-tips";
import { getGoalsAction } from "@/actions/goal-actions";

const DashboardPage = async () => {
  const response = await getGoalsAction();

  // temporary data
  const budget = {
    income: 5700,
    expenses: 3000,
  };

  return (
    <div className="flex flex-col gap-4 ">
      <FinantialTracker>
        <GoalsSection goals={response.data ?? []} />
      </FinantialTracker>
      <BudgetOverview budget={budget} />
      <FinancialTips goals={response.data ?? []} budget={budget} />
    </div>
  );
};

export default DashboardPage;
