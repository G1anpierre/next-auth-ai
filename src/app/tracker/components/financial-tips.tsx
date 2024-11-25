"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

export const FinancialTips = () => {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">Financial Tips</h1>
      </CardHeader>
      <CardBody>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>Save at least 20% of you income.</li>
          <li>Create and stick to a budget.</li>
          <li>Pay off hight-interest debt first.</li>
          <li>Build an emergency fund.</li>
          <li>Invest for long term goals.</li>
        </ul>
      </CardBody>
    </Card>
  );
};
