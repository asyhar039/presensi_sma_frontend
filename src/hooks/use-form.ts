import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { ButtonSubmit } from '@/components/form/button-submit'
import { FormField } from '@/components/form/form-field'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldComponents: {
    FormField,
  },
  formComponents: {
    ButtonSubmit,
  },
  fieldContext,
  formContext,
})

export { useAppForm, useFieldContext, useFormContext }
