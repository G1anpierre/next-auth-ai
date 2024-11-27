"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { Goal } from "@prisma/client";
import { useCompletion } from "ai/react";

export const FinancialTips = ({
  goals,
  budget,
}: {
  goals: Goal[];
  budget: { income: number; expenses: number };
}) => {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai/financial-tips",
  });

  const generateTips = async () => {
    const prompt = `Based on the following financial information, provide 3 personalized financial tips:
    Income: $${budget.income}
    Expenses: $${budget.expenses}
    Goals: ${goals
      .map((goal) => `${goal.name} ($${goal.current}/$${goal.target})`)
      .join(", ")}
    Provide specific, actionable advice tailored to this financial situation.`;

    await complete(prompt);
  };

  console.log("completion", completion);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">AI-Generated Financial Tips</h1>
        <p className="text-sm text-gray-500">
          Get personalized advice based on your financial situation.
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-gray-500">
          Click the button below to generate personalized financial tips.
        </p>
        <Button
          onPress={generateTips}
          isDisabled={isLoading}
          isLoading={isLoading}
          color="primary"
          className="w-fit"
        >
          {isLoading ? "Generating..." : "Generate Financial Tips"}
        </Button>
      </CardBody>
      <CardFooter>
        {completion && (
          <div className="space-y-6 w-full">
            {completion.split("\n\n").map((tip, index) => {
              // Skip empty strings
              if (!tip.trim()) return null;

              // Extract the number and title if present
              const match = tip.match(/(\d+)\.\s+\*\*([^:]+):\*\*/);
              if (!match) return null;

              const [_, number, title] = match;
              const content = tip.replace(/\d+\.\s+\*\*[^:]+:\*\*\s*/, "");

              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-default-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-default-600 leading-relaxed">
                      {content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
