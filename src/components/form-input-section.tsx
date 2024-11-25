"use client";

import React from "react";
import { Input } from "@nextui-org/react";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { SelectCategoryOptions } from "@/mock-data";
import { useActionState } from "react";
import { createGoalAction } from "@/actions/goal-actions";

const initialState = {
  message: "",
  success: false,
};

export const FormInputSection = () => {
  const [state, actionCreateGoal, isPending] = useActionState(
    createGoalAction,
    initialState
  );

  return (
    <form action={actionCreateGoal}>
      <div className="flex flex-col gap-4">
        <Input placeholder="Goal Name" name="goalName" type="string" />
        <Input placeholder="Target Amount" name="targetAmount" type="number" />
        <div className="flex gap-4">
          <Select placeholder="Category" className="max-w-xs" name="category">
            <SelectSection>
              {SelectCategoryOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
          <Button color="primary" type="submit" isLoading={isPending}>
            Add Goal
          </Button>
        </div>
      </div>
    </form>
  );
};
