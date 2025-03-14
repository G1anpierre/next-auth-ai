"use client";
import React from "react";
import GoalCard from "./goal-card";
import { Goal } from "@prisma/client";
import { ScrollShadow } from "@heroui/react";

const GoalsSection = ({ goals }: { goals: Goal[] }) => {

  if(goals.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p>No goals found, create one to get started</p>
      </div>
    )
  }

  return (
    <ScrollShadow className="h-[400px]">
      <div className="flex flex-col gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </ScrollShadow>
  );
};

export default GoalsSection;
