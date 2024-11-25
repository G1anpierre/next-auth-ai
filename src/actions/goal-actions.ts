"use server";

import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Create a Goal
export const createGoalAction = async (
  previousState: any,
  formData: FormData
) => {
  // Get the current session
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to create a goal",
        success: false,
      };
    }

    const goalName = formData.get("goalName");
    const targetAmount = formData.get("targetAmount");
    const category = formData.get("category");

    if (!goalName || !targetAmount || !category) {
      return {
        message: "Please fill out all fields",
        success: false,
      };
    }

    // Create the goal using Prisma
    const goal = await prisma.goal.create({
      data: {
        name: goalName.toString(),
        target: parseFloat(targetAmount.toString()),
        current: 0, // Starting with 0 progress
        category: category.toString(),
        userId: session.user.id,
      },
    });

    revalidatePath("/tracker");
    return {
      message: "Goal created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating goal:", error);
    return {
      message: "An error occurred while creating the goal",
      success: false,
    };
  }
};

// Get all Goals
export const getGoalsAction = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to view goals",
        success: false,
      };
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return {
      data: goals,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      message: "An error occurred while fetching goals",
      success: false,
    };
  }
};

// Update a Goal
export const updateGoalAction = async (
  previousState: any,
  formData: FormData
) => {
  try {
    const session = await auth();
  } catch (error) {
    console.error("Error updating goal:", error);
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
