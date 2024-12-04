"use client";

import MessageCard from "./message-card";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Prompt } from "../prompt/prompt";
import { useChat } from "ai/react";
import { Budget as BudgetType, Expense } from "@prisma/client";
import { convert } from "html-to-text";

export const Chat = ({
  budget,
  expenses,
}: {
  budget: BudgetType | undefined | null;
  expenses: Expense[];
}) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/ai/chat",
  });

  const financialData = JSON.stringify({
    budget: budget?.income,
    expenses: expenses.map((expense) => ({
      name: expense.category,
      amount: expense.amount,
    })),
  });

  return (
    <Card>
      <CardBody className="flex flex-col gap-4 px-1">
        {messages.map(({ role, content }, index) => (
          <MessageCard
            key={index}
            attempts={index === 1 ? 2 : 1}
            avatar={
              role === "assistant"
                ? "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
                : "https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
            }
            currentAttempt={index === 1 ? 2 : 1}
            message={convert(content)}
            messageClassName={role === "user" ? "bg-content3 text-content3-foreground" : ""}
            showFeedback={role === "assistant"}
          />
        ))}
      </CardBody>
      <CardFooter>
        <Prompt
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          financialData={financialData}
        />
      </CardFooter>
    </Card>
  );
};
