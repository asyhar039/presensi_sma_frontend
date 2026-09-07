import type { ConfigType } from 'dayjs'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/id'
import 'dayjs/locale/en'
import { DATE_FORMAT } from '@/constants/app'

dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export function formatDate(
  date?: ConfigType,
  format = DATE_FORMAT.DATE_TIME,
  errorValue = '-',
): string {
  const parsedDate = dayjs.utc(date)
  if (!parsedDate.isValid()) {
    return errorValue
  }

  return parsedDate.tz(dayjs.tz.guess()).format(format)
}
