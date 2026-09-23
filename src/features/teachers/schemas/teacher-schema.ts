import * as v from 'valibot'

import {
  TEACHER_EMPLOYMENT_STATUSES,
  TEACHER_GENDERS,
} from '@/features/teachers/types/teacher.types'

const identityNumberSchema = v.pipe(
  v.string('Identity number must be a string.'),
  v.trim(),
  v.nonEmpty('Please enter an identity number.'),
  v.maxLength(64, 'Identity number must be at most 64 characters.'),
)

const nameSchema = v.pipe(
  v.string('Name must be a string.'),
  v.trim(),
  v.nonEmpty('Please enter a name.'),
  v.maxLength(255, 'Name must be at most 255 characters.'),
)

const emailSchema = v.pipe(
  v.string('Email must be a string.'),
  v.trim(),
  v.nonEmpty('Please enter an email.'),
  v.email('Please enter a valid email.'),
  v.maxLength(255, 'Email must be at most 255 characters.'),
)

const phoneNumberSchema = v.nullish(
  v.pipe(
    v.string('Phone number must be a string.'),
    v.trim(),
    v.maxLength(32, 'Phone number must be at most 32 characters.'),
    v.transform((value) => (value === '' ? undefined : value)),
  ),
)

const addressSchema = v.nullish(
  v.pipe(
    v.string('Address must be a string.'),
    v.trim(),
    v.maxLength(128, 'Address must be at most 128 characters.'),
    v.transform((value) => (value === '' ? undefined : value)),
  ),
)

const genderSchema = v.picklist(TEACHER_GENDERS, 'Please select a gender.')

const employmentStatusSchema = v.picklist(
  TEACHER_EMPLOYMENT_STATUSES,
  'Please select an employment status.',
)

const passwordSchema = v.pipe(
  v.string('Password must be a string.'),
  v.minLength(8, 'Password must be at least 8 characters.'),
)

const passwordConfirmationSchema = v.pipe(
  v.string('Password confirmation must be a string.'),
  v.minLength(8, 'Password confirmation must be at least 8 characters.'),
)

const teacherBaseEntries = {
  identity_number: identityNumberSchema,
  name: nameSchema,
  email: emailSchema,
  phone_number: phoneNumberSchema,
  gender: genderSchema,
  address: addressSchema,
  employment_status: employmentStatusSchema,
}

export const teacherSchema = v.object(teacherBaseEntries)

export type ITeacherSchema = v.InferOutput<typeof teacherSchema>

export const teacherCreateSchema = v.pipe(
  v.object({
    ...teacherBaseEntries,
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['password_confirmation']],
      (input) => input.password === input.password_confirmation,
      'Password confirmation does not match.',
    ),
    ['password_confirmation'],
  ),
)

export type ITeacherCreateSchema = v.InferOutput<typeof teacherCreateSchema>

export const teacherPasswordSchema = v.pipe(
  v.object({
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['password_confirmation']],
      (input) => input.password === input.password_confirmation,
      'Password confirmation does not match.',
    ),
    ['password_confirmation'],
  ),
)

export type ITeacherPasswordSchema = v.InferOutput<typeof teacherPasswordSchema>
