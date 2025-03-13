"use server";

import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { SignupSchema } from "@/lib/definitions";

// Define the signup form schema

export async function signupAction(state: unknown, formData: FormData) {
  const submission = await parseWithZod(formData, { schema: SignupSchema });
  try {
    if (submission.status !== "success") {
      return submission.reply();
    }

    const { name, email, password } = submission.value;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return submission.reply({
        formErrors: ["User already exists"],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return submission.reply({
      formErrors: ["An error occurred during signup. Please try again."],
    });
  }
  redirect("/login");
}
