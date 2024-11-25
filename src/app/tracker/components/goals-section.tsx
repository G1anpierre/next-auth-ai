import { getGoalsAction } from "@/actions/goal-actions";
import React from "react";
import GoalCard from "./goal-card";

const GoalsSection = async () => {
  const response = await getGoalsAction();

  return (
    <div className="flex flex-col gap-4">
      {response.data?.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalsSection;
