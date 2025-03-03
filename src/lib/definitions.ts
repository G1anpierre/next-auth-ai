import { Goal } from "@prisma/client";
import { z } from 'zod';


export type GoalResponse = {
  data?: Goal[];
  message?: string;
  success: boolean;
};


export const GoalSchema = z.object({
  goalName: z.string(),
  targetAmount: z.number(),
  category: z.string(),
  targetDate: z.date(),
  priority: z.string(),
});