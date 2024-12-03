"use client";
import { createExpenseAction } from "@/actions/expenpence-actions";
import {
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectSection,
  SelectItem,
  Input,
  Switch,
  Button,
} from "@nextui-org/react";
import { useActionState } from "react";

import React from "react";

const initialState = {
  message: "",
  success: false,
};

const SelectExpensesOptions = [
  { key: "food", value: "Food" },
  { key: "transportation", value: "Transportation" },
  { key: "housing", value: "Housing" },
  { key: "utilities", value: "Utilities" },
  { key: "entertainment", value: "Entertainment" },
  { key: "health", value: "Health" },
  { key: "education", value: "Education" },
  { key: "other", value: "Other" },
];

export const ExpensesTracker = () => {
  const [isSelected, setIsSelected] = React.useState(false);

  const [state, actionCreateExpense, isPending] = useActionState(
    createExpenseAction,
    initialState
  );

  return (
    <form action={actionCreateExpense}>
      <Card>
        <CardHeader className="flex flex-col gap-1 items-start">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-base text-default-500">Track your expenses</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <Select
              placeholder="Category"
              className="max-w-xs"
              name="categoryExpense"
            >
              <SelectSection>
                {SelectExpensesOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectSection>
            </Select>
            <Input
              placeholder="Amount"
              name="amountExpense"
              type="number"
              className="max-w-xs"
            />
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
        </CardBody>
      </Card>
    </form>
  );
};
