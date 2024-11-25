"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { FormInputSection } from "./form-input-section";

export const FinantialTracker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">Personal Finance Goal Tracker</h1>
        <p className="text-base text-default-500">
          Set and track your financial goals
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <FormInputSection />
        {children}
      </CardBody>
    </Card>
  );
};
