"use server";


import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Goal } from "@prisma/client";
import { GoalResponse, GoalSchema } from "@/lib/definitions";
import { parseWithZod } from '@conform-to/zod';

// Zod schema for Goal


// Create a Goal
export const createGoalAction = async (previousState: unknown, formData: FormData) => {
  // Get the current session
  const submission = parseWithZod(formData, {
    schema: GoalSchema,
  })


  try {
    const session = await auth();

    if (!session?.user?.id) {
      return submission.reply();
    }

    
    if (submission.status !== 'success') {
      return submission.reply();
    }
    
    const goalName = formData.get("goalName");
    const targetAmount = formData.get("targetAmount");
    const category = formData.get("category");
    const targetDate = formData.get("targetDate");
    const priority = formData.get("priority");

    if (!goalName || !targetAmount || !category || !targetDate || !priority) {
      return submission.reply();
    }

    // Create the goal using Prisma
    await prisma.goal.create({
      data: {
        name: goalName.toString(),
        target: parseFloat(targetAmount.toString()),
        current: 0, // Starting with 0 progress
        category: category.toString(),
        targetDate: new Date(targetDate.toString()),
        priority: priority.toString(),
        userId: session.user.id,
      },
    });

    
  } catch (error) {
    console.error("Error creating goal:", error);
    return submission.reply();
    
  }
  
  revalidatePath("/dashboard");
};


// Get all Goals
export const getGoalsAction = async (): Promise<GoalResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        data: [],
        message: "You must be logged in to view goals",
        success: false,
      };
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return {
      data: goals,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      data: [],
      message: "An error occurred while fetching goals",
      success: false,
    };
  }
};

// Delete a Goal
export const deleteGoalAction = async (goalId: number) => {
  try {
    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    revalidatePath("/tracker");
    return {
      message: "Goal deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return {
      message: "An error occurred while deleting the goal",
      success: false,
    };
  }
};

// Update a Goal
export const updateGoalAction = async (goalId: number, amount: number) => {
  try {
    // First, get the current value
    const currentGoal = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { current: true, target: true },
    });

    if (!currentGoal) {
      return {
        message: "Goal not found",
        success: false,
      };
    }

    await prisma.goal.update({
      where: { id: goalId },
      data: {
        current:
          currentGoal.current + amount >= currentGoal.target
            ? currentGoal.target
            : currentGoal.current + amount,
      },
    });

    revalidatePath("/tracker");
    return {
      message: "Goal updated successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error updating goal:", error);
    return {
      message: "An error occurred while updating the goal",
      success: false,
    };
  }
};

