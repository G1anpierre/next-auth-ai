"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Goal } from "@prisma/client";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from "zod";

export const FinancialTips = ({
  goals,
  budget,
}: {
  goals: Goal[];
  budget: {
    income: number;
    totalExpenses: number;
    detailExpenses?: { name: string; amount: number }[];
  };
}) => {
  const { object, submit, isLoading } = useObject({
    api: "/api/ai/financial-tips",
    schema: z.object({
      tips: z.array(
        z.object({
          number: z.number().describe("The tip number"),
          title: z.string().describe("The tip title"),
          content: z.string().describe("The tip content"),
        })
      ),
    }),
  });

  const generateTips = () => {
    const prompt = `Based on the following financial information, provide 6 personalized financial tips:
    monthly income: $${budget.income}
    monthly expenses: $${budget.totalExpenses}
    ${
      budget.detailExpenses
        ? `Detailed expenses: ${budget.detailExpenses
            .map((expense) => `${expense.name}: $${expense.amount}`)
            .join(", ")}`
        : ""
    }
    available cash: $${budget.income - budget.totalExpenses}
    Goals: ${goals
      .map(
        (goal) =>
          `${goal.name} (currently saved: $${
            goal.current
          }, target to achieve: $${goal.target}) by ${goal.targetDate ?? "no target date"}`
      )
      .join(", ")}
  `;

    submit(prompt);
  };


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
        <div className="flex flex-col gap-4">
          {object?.tips &&
            object.tips.map((tip, key) => (
              <div
                key={`${tip?.number}-${key}`}
                className="flex gap-4 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {tip?.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-default-900 mb-2">{tip?.title}</h3>
                  <p className="text-default-600 leading-relaxed">{tip?.content}</p>
                </div>
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};
