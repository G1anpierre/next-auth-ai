"use server";

export const createGoalAction = async (
  previousState: any,
  formData: FormData
) => {
  const goalName = formData.get("goalName");
  const targetAmount = formData.get("targetAmount");
  const category = formData.get("category");

  if (!goalName || !targetAmount || !category) {
    return {
      message: "Please fill out all fields",
    };
  }

  //   TODO: Implement the call to the API to create a goal with Prisma

  return {
    goalName: "",
    targetAmount: 0,
    category: "",
  };
};
