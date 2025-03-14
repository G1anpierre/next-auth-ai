"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/definitions";
import { parseWithZod } from "@conform-to/zod";
export async function signInGithub() {
  return signIn("github", { redirectTo: "/dashboard" });
}

export async function signInGoogle() {
  return signIn("google", { redirectTo: "/dashboard" });
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
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    return result
  } catch (error) {
    return parsedCredentials.reply({
      formErrors: ["An error occurred during sign in"],
    });
  }
}
