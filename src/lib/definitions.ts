import { Goal } from "@prisma/client";

export type GoalResponse = {
  data?: Goal[];
  message?: string;
  success: boolean;
};