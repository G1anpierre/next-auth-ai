"use client";

import { createBudgetAction } from "@/actions/expenpence-actions";
import { Card, CardBody, CardHeader, Chip, Input } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Budget as BudgetType } from "@prisma/client";
import { formatCurrency } from "@/utils/format-currency";

export const Budget = ({
  budget,
  totalExpenses,
}: {
  budget: BudgetType | undefined | null;
  totalExpenses: number;
}) => {
  const [income, setIncome] = useState(budget?.income ?? 0);

  useEffect(() => {
    const createBudget = async () => {
      await createBudgetAction(income.toString());
    };

    if (income > 0) {
      createBudget();
    }
  }, [income]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">Budget</h1>
        <p className="text-base text-default-500">Set your budget</p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input
          type="number"
          label="Income"
          placeholder="0.00"
          labelPlacement="outside"
          value={income.toString()}
          onChange={async (e) => {
            setIncome(parseFloat(e.target.value));
          }}
          name="income"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <Input
          type="number"
          label="Expenses"
          placeholder="0.00"
          labelPlacement="outside"
          isReadOnly
          disabled
          defaultValue={totalExpenses.toString()}
          value={totalExpenses.toString()}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <div className="flex justify-between">
          <p className="font-bold">Available for Goals</p>
          <p className="font-bold">
            {income - totalExpenses > 0
              ? `${formatCurrency(income - totalExpenses)}`
              : "No available funds"}
          </p>
        </div>
        <div>
          <Chip color="success">Budget Allocation</Chip>
        </div>
      </CardBody>
    </Card>
  );
};
