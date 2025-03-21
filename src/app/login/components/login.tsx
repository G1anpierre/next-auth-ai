"use client";

import React, { useEffect } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signInCredentials, signInGithub, signInGoogle } from "@/actions/sign-in";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { LoginSchema } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { MagicLinkForm } from "./magic-link-form";

export const Login = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const [lastResult, actionSignInCredentials, isPending] = useActionState(signInCredentials, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  useEffect(() => {
    if (typeof lastResult === 'string') {
      router.push(lastResult);
    }
  }, [lastResult]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Log In</p>
        <form id={form.id} action={actionSignInCredentials} className="flex flex-col gap-3" onSubmit={form.onSubmit}>
          <Input
            label="Email Address"
            name={fields.email.name}
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            key={fields.email.key}
            defaultValue={fields.email.value}
            errorMessage={fields.email.errors}
            isInvalid={!!fields.email.errors?.length}
          />
          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name={fields.password.name}
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            key={fields.password.key}
            defaultValue={fields.password.value}
            errorMessage={fields.password.errors}
            isInvalid={!!fields.password.errors?.length}
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {form.errors?.map((error) => (
              <p key={error} className="text-danger-500 text-sm">{error}</p>
            ))}
          </div>
          <Button color="primary" type="submit" isLoading={isPending}>
            Log In
          </Button>
        </form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
         <p className="text-center text-sm text-default-500">
           Sign in with Magic Link
         </p>
         <MagicLinkForm />
       </div>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <form action={signInGoogle} className="flex-1">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              fullWidth
              type="submit"
              variant="bordered"
            >
              Continue with Google
            </Button>
          </form>
          <form action={signInGithub} className="flex-1">
            <Button
              startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
              fullWidth
              type="submit"
              variant="bordered"
            >
              Continue with Github
            </Button>
          </form>
        </div>
        <p className="text-center text-sm">
          Need to create an account?&nbsp;
          <Link href="/signup" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
