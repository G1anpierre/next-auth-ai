"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { FormInputSection } from "./form-input-section";

export const FinantialTracker = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 items-start">
        <h1 className="text-2xl">Personal Finance Goal Tracker</h1>
        <p className="text-base">Set and track your financial goals</p>
      </CardHeader>
      <CardBody>
        <FormInputSection />
      </CardBody>
    </Card>
  );
};
