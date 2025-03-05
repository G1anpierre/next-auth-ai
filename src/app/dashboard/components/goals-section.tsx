"use client";
import React from "react";
import GoalCard from "./goal-card";
import { Goal } from "@prisma/client";
import { ScrollShadow } from "@heroui/react";

const GoalsSection = ({ goals }: { goals: Goal[] }) => {
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
