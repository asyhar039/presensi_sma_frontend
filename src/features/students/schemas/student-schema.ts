import * as v from 'valibot'

import {
  STUDENT_GENDERS,
  STUDENT_STATUSES,
} from '@/features/students/types/student.types'

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

const genderSchema = v.picklist(STUDENT_GENDERS, 'Please select a gender.')

const statusSchema = v.picklist(STUDENT_STATUSES, 'Please select a status.')

const passwordSchema = v.pipe(
  v.string('Password must be a string.'),
  v.minLength(8, 'Password must be at least 8 characters.'),
)

const passwordConfirmationSchema = v.pipe(
  v.string('Password confirmation must be a string.'),
  v.minLength(8, 'Password confirmation must be at least 8 characters.'),
)

const studentBaseEntries = {
  identity_number: identityNumberSchema,
  name: nameSchema,
  email: emailSchema,
  phone_number: phoneNumberSchema,
  gender: genderSchema,
  address: addressSchema,
  status: statusSchema,
}

export const studentSchema = v.object(studentBaseEntries)

export type IStudentSchema = v.InferOutput<typeof studentSchema>

export const studentCreateSchema = v.pipe(
  v.object({
    ...studentBaseEntries,
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

export type IStudentCreateSchema = v.InferOutput<typeof studentCreateSchema>

export const studentPasswordSchema = v.pipe(
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

export type IStudentPasswordSchema = v.InferOutput<typeof studentPasswordSchema>
