import React from "react";

import { FinantialTracker } from "@/components/finantial-tracker";
import GoalsSection from "./components/goals-section";

const TrackerPage = () => {
  return (
    <main className="mt-40">
      <FinantialTracker>
        <GoalsSection />
      </FinantialTracker>
    </main>
  );
};

export default TrackerPage;
