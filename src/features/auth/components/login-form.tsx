import { useNavigate, useRouterState } from '@tanstack/react-router'

import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { useLogin } from '@/features/auth/hooks/use-login'
import { loginSchema } from '@/features/auth/schemas/login-schema'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'
import { delay } from '@/utils/time'

export function LoginForm() {
  const { login } = useAuth()
  const submit = useLogin()
  const navigate = useNavigate()
  const redirectTo = useRouterState({
    select: (state) => state.location.state.redirectTo,
  })

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const data = await submit.mutateAsync(value)
        login(data.user)
        await delay(100)
        navigate({ to: redirectTo || '/dashboard', replace: true })
      } catch (error) {
        formErrorHandler(error, form, 'Failed to login. Please try again.')
      }
    },
  })

  return (
    <form
      noValidate
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        <FieldGroup>
          <form.AppField name="email">
            {(field) => (
              <field.FormField<string>
                label="Email"
                children={({ isInvalid, onChange, ...props }) => (
                  <Input
                    type="email"
                    placeholder="Your email"
                    autoComplete="off"
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.FormField<string>
                label="Password"
                children={({ isInvalid, onChange, ...props }) => (
                  <Input
                    type="password"
                    placeholder="Your password"
                    autoComplete="off"
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.ButtonSubmit label="Login" />
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
