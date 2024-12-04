"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { formatCurrency } from "@/utils/format-currency";

export const BudgetOverview = ({ budget }: { budget: { income: number; expenses: number } }) => {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">Budget Overview</h1>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-[1fr_120px] gap-4">
          <div className="flex flex-col gap-2">
            <p>Income:</p>
            <p>Expenses:</p>
            <p className="font-bold">Available for Goals:</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>{formatCurrency(budget.income)}</p>
            <p>{formatCurrency(budget.expenses)}</p>
            <p className="font-bold">{formatCurrency(budget.income - budget.expenses)}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
