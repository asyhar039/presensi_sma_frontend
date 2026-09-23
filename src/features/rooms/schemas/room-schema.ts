import * as v from 'valibot'

export const roomSchema = v.object({
  name: v.pipe(
    v.string('Room name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a room name.'),
    v.maxLength(64, 'Room name must be at most 64 characters.'),
  ),
})

export type IRoomSchema = v.InferOutput<typeof roomSchema>
