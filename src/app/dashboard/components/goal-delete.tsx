import { deleteGoalAction } from "@/actions/goal-actions";
import { Button } from "@nextui-org/react";
import React, { useActionState } from "react";

export const GoalDelete = ({ goalId }: { goalId: number }) => {
  const [state, actionDeleteGoal, isPending] = useActionState(
    deleteGoalAction.bind(null, goalId),
    null
  );

  return (
    <form action={actionDeleteGoal}>
      <Button color="danger" isLoading={isPending} type="submit">
        Delete
      </Button>
    </form>
  );
};
