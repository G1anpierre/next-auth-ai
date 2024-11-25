"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Progress,
} from "@nextui-org/react";
import { Goal } from "@prisma/client";
import { formatCurrency } from "@/utils/format-currency";
import { GoalDelete } from "./goal-delete";

const GoalCard = ({ goal }: { goal: Goal }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-start">
        <h1 className="text-xl font-bold">{goal.name}</h1>
        <p className="text-base text-default-500">{goal.category}</p>
      </CardHeader>
      <CardBody>
        <Progress
          value={goal.current}
          maxValue={goal.target}
          className="mb-2"
        />
        <div className="flex justify-between w-full">
          <p className="text-sm">
            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
          </p>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Input
              type="number"
              className="max-w-xs"
              placeholder="Amount"
              min={0}
            />
            <Button color="primary">Update</Button>
          </div>
          <GoalDelete goalId={goal.id} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;
