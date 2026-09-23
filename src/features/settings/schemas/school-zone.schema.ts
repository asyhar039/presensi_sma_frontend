import * as v from 'valibot'

const latitudeSchema = v.pipe(
  v.number('Latitude must be a number.'),
  v.minValue(-90, 'Latitude must be between -90 and 90.'),
  v.maxValue(90, 'Latitude must be between -90 and 90.'),
)

const longitudeSchema = v.pipe(
  v.number('Longitude must be a number.'),
  v.minValue(-180, 'Longitude must be between -180 and 180.'),
  v.maxValue(180, 'Longitude must be between -180 and 180.'),
)

export const schoolZoneSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a zone name.'),
    v.maxLength(120, 'Name must be at most 120 characters.'),
  ),
  points: v.pipe(
    v.array(v.tuple([latitudeSchema, longitudeSchema])),
    v.minLength(3, 'Draw at least 3 points to form a school zone.'),
  ),
})
