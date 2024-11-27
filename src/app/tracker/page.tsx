import React from "react";

import { FinantialTracker } from "@/components/finantial-tracker";
import GoalsSection from "./components/goals-section";
import { BudgetOverview } from "./components/budget-overview";
import { FinancialTips } from "./components/financial-tips";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getGoalsAction } from "@/actions/goal-actions";

const TrackerPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const response = await getGoalsAction();

  // temporary data
  const budget = {
    income: 5000,
    expenses: 2000,
  };

  return (
    <main className="mt-20 flex flex-col gap-4">
      <FinantialTracker>
        <GoalsSection goals={response.data ?? []} />
      </FinantialTracker>
      <BudgetOverview budget={budget} />
      <FinancialTips goals={response.data ?? []} budget={budget} />
    </main>
  );
};

export default TrackerPage;
