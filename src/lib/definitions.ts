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

export const ExpenseSchema = z.object({
  categoryExpense: z.string(),
  amountExpense: z.number(),
  recurringExpense: z.boolean(),
})

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => {
    return val === true
  }, {
    message: 'You must agree to the Terms and Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignupFormType = z.infer<typeof SignupSchema>

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormType = z.infer<typeof LoginSchema>
