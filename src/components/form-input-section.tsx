"use client";

import React from "react";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Input } from "@heroui/react";
import { Select, SelectSection, SelectItem, DatePicker } from "@heroui/react";
import { Button } from "@heroui/react";
import { SelectCategoryOptions } from "@/mock-data";
import { useActionState } from "react";
import { createGoalAction } from "@/actions/goal-actions";
import { GoalSchema } from "@/lib/definitions";

const SelectPriorityOptions = [
  { key: "Low", value: "Low" },
  { key: "Medium", value: "Medium" },
  { key: "High", value: "High" },
];

export const FormInputSection = () => {
  const [lastResult, actionCreateGoal, isPending] = useActionState(createGoalAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: GoalSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const priority = useInputControl(fields.priority);
  const category = useInputControl(fields.category);

  return (
    <form id={form.id} action={actionCreateGoal} onSubmit={form.onSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Goal Name"
          type="string"
          key={fields.goalName.key}
          name={fields.goalName.name}
          label="Goal Name"
          errorMessage={fields.goalName.errors}
          isInvalid={!!fields.goalName.errors?.length}
          defaultValue={fields.goalName.initialValue}
        />
        <Input
          placeholder="Target Amount"
          type="number"
          key={fields.targetAmount.key}
          name={fields.targetAmount.name}
          label="Target Amount"
          errorMessage={fields.targetAmount.errors}
          isInvalid={!!fields.targetAmount.errors?.length}
          defaultValue={fields.targetAmount.initialValue}
        />
        <div className="flex gap-4 flex-wrap">
          <Select
            label="Select a Priority"
            placeholder="Priority"
            className="max-w-xs"
            errorMessage={fields.targetAmount.errors}
            isInvalid={!!fields.priority.value}
            key={fields.priority.key}
            name={fields.priority.name}
            value={priority.value}
            onChange={() => priority.change}
            onFocus={priority.focus}
            onBlur={priority.blur}
          >
            <SelectSection>
              {SelectPriorityOptions.map((option) => (
                <SelectItem key={option.key}>{option.value}</SelectItem>
              ))}
            </SelectSection>
          </Select>
          <Select
            label="Select a Category"
            placeholder="Category"
            className="max-w-xs"
            errorMessage={fields.category.errors}
            isInvalid={!!fields.priority.value}
            key={fields.category.key}
            name={fields.category.name}
            value={category.value}
            onSelectionChange={() => category.change}
            onFocus={category.focus}
            onBlur={category.blur}
          >
            <SelectSection>
              {SelectCategoryOptions.map((option) => (
                <SelectItem key={option.key}>{option.value}</SelectItem>
              ))}
            </SelectSection>
          </Select>
          <DatePicker
            label="Target Date"
            labelPlacement="inside"
            className="max-w-xs"
            key={fields.targetDate.key}
            name={fields.targetDate.name}
          />
          <Button color="primary" type="submit" isLoading={isPending}>
            Add Goal
          </Button>
        </div>
      </div>
    </form>
  );
};
