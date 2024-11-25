import { updateGoalAction } from "@/actions/goal-actions";
import { Button, Input } from "@nextui-org/react";
import React, { useActionState, useState } from "react";

export const GoalUpdate = ({ goalId }: { goalId: number }) => {
  const [amount, setAmount] = useState("0");

  const [state, actionUpdateGoal, isPending] = useActionState(
    updateGoalAction.bind(null, goalId, Number(amount)),
    null
  );

  return (
    <form className="flex gap-2" action={actionUpdateGoal}>
      <Input
        type="number"
        className="max-w-xs"
        name="amount"
        placeholder="0.00"
        labelPlacement="outside"
        min={0}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">$</span>
          </div>
        }
        value={amount}
        onValueChange={setAmount}
      />
      <Button color="primary" type="submit" isLoading={isPending}>
        Update
      </Button>
    </form>
  );
};
