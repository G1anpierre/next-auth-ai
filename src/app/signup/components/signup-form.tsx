'use client'

import { useState } from 'react'
import { Button, Input, Checkbox } from '@heroui/react'
import { Icon } from '@iconify/react'
import { signupAction } from '@/actions/auth-actions'
import { useActionState } from 'react'
import { parseWithZod } from '@conform-to/zod'
import { useForm, useInputControl } from '@conform-to/react'
import { SignupSchema } from '@/lib/definitions'

export function SignupForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)


  const [lastResult, formAction, pending] = useActionState(signupAction, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  const checkBox = useInputControl(fields.agreeToTerms)

  return (
    <form id={form.id} action={formAction} onSubmit={form.onSubmit} noValidate className="mt-8 space-y-6">
      <div className="space-y-4">
        <Input
          isRequired
          label="Name"
          name={fields.name.name}
          placeholder="Enter your name"
          type="text"
          variant="bordered"
          key={fields.name.key}
          errorMessage={fields.name.errors}
          isInvalid={!!fields.name.errors?.length}
        />
        <Input
          isRequired
          label="Email Address"
          name={fields.email.name}
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          key={fields.email.key}
          errorMessage={fields.email.errors}
          isInvalid={!!fields.email.errors?.length}
        />
        <Input
          isRequired
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
          errorMessage={fields.password.errors}
          isInvalid={!!fields.password.errors?.length}
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
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
          label="Confirm Password"
          name={fields.confirmPassword.name}
          placeholder="Confirm your password"
          type={isConfirmVisible ? "text" : "password"}
          variant="bordered"
          key={fields.confirmPassword.key}
          errorMessage={fields.confirmPassword.errors}
          isInvalid={!!fields.confirmPassword.errors?.length}
        />
        <div className="flex items-center">
          <Checkbox
            isRequired
            name={fields.agreeToTerms.name}
            size="sm"
            key={fields.agreeToTerms.key}
            value={checkBox.value === 'true' ? 'on' : 'off'}
            onValueChange={(isSelected) => {
              checkBox.change(isSelected ? 'true' : 'false')
            }}
            onFocus={checkBox.focus}
            onBlur={checkBox.blur}
            isInvalid={!!fields.agreeToTerms.errors?.length}
          >
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </Checkbox>
        </div>
         {fields.agreeToTerms.errors && fields.agreeToTerms.errors.length > 0 && (
          <p className="text-sm text-red-500">{fields.agreeToTerms.errors[0]}</p>
        )}
      </div>

      {lastResult?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-500">{lastResult.error._form?.[0]}</p>
        </div>
      )}

      <Button
        color="primary"
        type="submit"
        className="w-full"
        isLoading={pending}
        disabled={pending}
      >
        Sign Up
      </Button>
    </form>
  )
} 