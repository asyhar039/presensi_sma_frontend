import * as v from 'valibot'

const searchNumber = v.optional(
  v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => Number(value)),
  ),
)

export const permitSearchSchema = v.looseObject({
  page: searchNumber,
  per_page: searchNumber,
  search: v.optional(v.string()),
  sortBy: v.optional(v.string()),
  order: v.optional(v.picklist(['asc', 'desc'])),
  classroom_id: v.optional(v.string()),
  type: v.optional(v.string()),
  status: v.optional(v.string()),
})

export type PermitSearch = v.InferOutput<typeof permitSearchSchema>
