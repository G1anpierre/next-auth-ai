"use server";

import * as auth from "@/auth";
import { LoginSchema } from "@/lib/definitions";
import { parseWithZod } from "@conform-to/zod";
export async function signInGithub() {
  return auth.signIn("github", { redirectTo: "/dashboard" });
}

export async function signInGoogle() {
  return auth.signIn("google", { redirectTo: "/dashboard" });
}

export async function signInCredentials(state: unknown, formData: FormData) {
  const parsedCredentials = parseWithZod(formData, { schema: LoginSchema });
  if (parsedCredentials.status !== 'success') {
    return parsedCredentials.reply({
      formErrors: ["Invalid email or password"],
    });
  }
  const { email, password } = parsedCredentials.value;
  try {
    const result = await auth.signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return result;
  } catch (error) {
    return parsedCredentials.reply({
      resetForm: false,
      formErrors: ["Invalid email or password"],
    });
  }
  
}
