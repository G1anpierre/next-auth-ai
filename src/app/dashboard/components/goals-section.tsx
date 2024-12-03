import { getGoalsAction } from "@/actions/goal-actions";
import React from "react";
import GoalCard from "./goal-card";
import { Goal } from "@prisma/client";

const GoalsSection = async ({ goals }: { goals: Goal[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalsSection;
