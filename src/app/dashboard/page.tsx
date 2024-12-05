import React from "react";

import { FinantialTracker } from "@/components/finantial-tracker";
import GoalsSection from "./components/goals-section";
import { BudgetOverview } from "./components/budget-overview";
import { FinancialTips } from "./components/financial-tips";
import { getGoalsAction } from "@/actions/goal-actions";
import { getBudgetAction, getExpensesAction } from "@/actions/expenpence-actions";

const DashboardPage = async () => {
  const response = await getGoalsAction();
  const { totalExpenses, data: expenses } = await getExpensesAction();
  const { data: income } = await getBudgetAction();

  // temporary data
  const budget = {
    income: income?.income ?? 0,
    totalExpenses: totalExpenses ?? 0,
    detailExpenses: expenses?.map((expense) => ({
      name: expense.category,
      amount: expense.amount,
    })),
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
