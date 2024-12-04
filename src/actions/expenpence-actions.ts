"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const createExpenseAction = async (previousState: any, formData: FormData) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to create an expense",
        success: false,
      };
    }

    const category = formData.get("categoryExpense");
    const amount = formData.get("amountExpense");
    const isRecurring = formData.get("recurringExpense");

    if (!category || !amount || !isRecurring) {
      return {
        message: "Please fill out all fields",
        success: false,
      };
    }

    const expense = await prisma.expense.create({
      data: {
        category: category.toString(),
        amount: parseFloat(amount.toString()),
        recurring: isRecurring === "true",
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/expenses");

    return {
      message: "Expense created successfully!",
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "An error occurred while creating the expense",
      success: false,
    };
  }
};

export const getExpensesAction = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to view expenses",
        success: false,
      };
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const totalExpenses = await prisma.expense.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      data: expenses,
      totalExpenses: totalExpenses._sum.amount,
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "An error occurred while fetching the expenses",
      success: false,
    };
  }
};

export const deleteExpenseAction = async (id: number) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to delete an expense",
        success: false,
      };
    }

    await prisma.expense.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/expenses");

    return {
      message: "Expense deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "An error occurred while deleting the expense",
      success: false,
    };
  }
};

export const createBudgetAction = async (income: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to create a budget",
        success: false,
      };
    }

    if (!income) {
      return {
        message: "Please fill out all fields",
        success: false,
      };
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        income: parseFloat(income),
        userId: session.user.id,
      },
      create: {
        income: parseFloat(income),
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/expenses");

    return {
      data: budget,
      message: "Budget created successfully!",
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "An error occurred while creating the budget",
      success: false,
    };
  }
};

export const getBudgetAction = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        message: "You must be logged in to view the budget",
        success: false,
      };
    }

    const budget = await prisma.budget.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return {
      data: budget,
      message: "Budget fetched successfully!",
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "An error occurred while fetching the budget",
      success: false,
    };
  }
};
