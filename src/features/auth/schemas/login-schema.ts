import * as v from 'valibot'

export const loginSearch = v.object({
  error_code: v.optional(v.string()),
})

export type ILoginSearch = v.InferOutput<typeof loginSearch>

export const loginSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
  ),
})

export type ILoginSchema = v.InferOutput<typeof loginSchema>
