import { Button } from '@heroui/react'
import React from 'react'
import { signInMagicLink } from '@/actions/sign-in'
import { Input } from '@heroui/react'
import { useActionState } from 'react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { MagicLinkSchema } from '@/lib/definitions'

export const MagicLinkForm = () => {
  const [lastResult, actionSignInMagicLink, isPending] = useActionState(signInMagicLink, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: MagicLinkSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  console.log({lastResult})

  return (
    <form id={form.id} action={actionSignInMagicLink} onSubmit={form.onSubmit} className="flex flex-col gap-2">
        <Input 
            type="email" 
            name={fields.email.name} 
            variant="bordered" 
            placeholder="Email" 
            key={fields.email.key} 
            defaultValue={fields.email.value} 
            errorMessage={fields.email.errors} 
            isInvalid={!!fields.email.errors?.length} 
        />
        <Button color="secondary" type="submit" isLoading={isPending}>Send Magic Link</Button>
    </form>
  )
}
