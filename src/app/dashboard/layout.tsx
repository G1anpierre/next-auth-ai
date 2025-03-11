'use server';

import React from "react";
import { Dashboard } from "./components/dashboard";
import { auth } from "@/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div>
      <Dashboard session={session}>{children}</Dashboard>
    </div>
  );
};

export default DashboardLayout;
