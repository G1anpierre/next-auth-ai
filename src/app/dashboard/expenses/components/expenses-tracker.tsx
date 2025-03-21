"use client";
import { createExpenseAction } from "@/actions/expenpence-actions";
import { SelectExpensesOptions } from "@/utils/data";
import { formatValue } from "@/utils/format-currency";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Switch,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Expense } from "@prisma/client";
import { useActionState } from "react";

import React from "react";
import { CircleChartCard } from "./circle-chart-card";

const initialState = {
  message: "",
  success: false,
};

export const ExpensesTracker = ({ expenses }: { expenses: Expense[] }) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const [state, actionCreateExpense, isPending] = useActionState(createExpenseAction, initialState);


  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 items-center basis-1/2">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-base text-default-500 text-center">Track your expenses</p>
        </div>
        {expenses.length > 0 && (
        <div className="basis-1/2">
          <CircleChartCard
            title="Total Expenses"
            value={formatValue(expenses.reduce((acc, expense) => acc + expense.amount, 0))}
            unit="avg."
            color="primary"
            categories={expenses.map((expense) => expense.category)}
            chartData={expenses.map((expense) => ({
              name: expense.category,
              value: expense.amount,
            }))}
          />
        </div>
      )}
      </CardHeader>
      <form action={actionCreateExpense}>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <Autocomplete
              placeholder="Category"
              allowsCustomValue
              className="max-w-xs"
              defaultItems={SelectExpensesOptions}
              name="categoryExpense"
            >
              {(item) => <AutocompleteItem key={item.key}>{item.value}</AutocompleteItem>}
            </Autocomplete>
            <Input placeholder="Amount" name="amountExpense" type="number" className="max-w-xs" />
            <Switch
              isSelected={isSelected}
              value={isSelected.toString()}
              name="recurringExpense"
              onValueChange={setIsSelected}
            >
              Recurring
            </Switch>
            <Button color="primary" type="submit" isLoading={isPending}>
              Add Expense
            </Button>
          </div>
        {state.message && !state.success && <p className="text-sm text-danger">{state.message}</p>}
        </CardBody>
      </form>
    </Card>
  );
};
