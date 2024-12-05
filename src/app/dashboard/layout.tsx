import React from "react";
import { Dashboard } from "./components/dashboard";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <Dashboard session={session}>{children}</Dashboard>
    </div>
  );
};

export default DashboardLayout;
