import type {
  AttendanceStatus,
  IAttendanceListResult,
  IAttendanceParams,
  IAttendanceRecord,
  IAttendanceStudent,
  IAttendanceSummary,
  IClassOption,
  IMonthOption,
  ISemesterOption,
  IStudentAttendanceDetail,
  IStudentAttendanceSummary,
} from '@/features/attendance/types/attendance.types'

const MOCK_STUDENTS: IAttendanceStudent[] = Array.from(
  { length: 35 },
  (_, i) => ({
    id: i + 1,
    user: {
      id: i + 1,
      identity_number: `2024${String(i + 1).padStart(4, '0')}`,
      name: `Siswa ${String(i + 1).padStart(2, '0')}`,
      email: `siswa${i + 1}@example.com`,
    },
    gender: {
      key: i % 2 === 0 ? 'male' : 'female',
      label: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
    },
  }),
)

const SUBJECTS = [
  { id: 1, name: 'Matematika' },
  { id: 2, name: 'Bahasa Indonesia' },
  { id: 3, name: 'Bahasa Inggris' },
  { id: 4, name: 'Fisika' },
  { id: 5, name: 'Kimia' },
  { id: 6, name: 'Biologi' },
  { id: 7, name: 'Sejarah' },
  { id: 8, name: 'Geografi' },
  { id: 9, name: 'Ekonomi' },
  { id: 10, name: 'Sosiologi' },
]

const CLASSROOMS: IClassOption[] = [
  {
    id: 1,
    name: 'X IPA 1',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
  {
    id: 2,
    name: 'X IPA 2',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
  {
    id: 3,
    name: 'X IPS 1',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
  {
    id: 4,
    name: 'XI IPA 1',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
  {
    id: 5,
    name: 'XI IPS 1',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
  {
    id: 6,
    name: 'XII IPA 1',
    academic_year: {
      id: 1,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      semester: 'Ganjil',
    },
  },
]

const MONTHS: IMonthOption[] = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

const SEMESTERS: ISemesterOption[] = [
  { value: 'ganjil', label: 'Semester Ganjil' },
  { value: 'genap', label: 'Semester Genap' },
]

const STATUSES: AttendanceStatus[] = ['present', 'permission', 'sick', 'absent']

function generateMockRecords(
  classroomId: number,
  month: number,
  _semester: string,
): IAttendanceRecord[] {
  const records: IAttendanceRecord[] = []
  const students = MOCK_STUDENTS
  const daysInMonth = new Date(2024, month, 0).getDate()

  let recordId = 1

  for (const student of students) {
    for (let day = 1; day <= daysInMonth; day++) {
      if (Math.random() > 0.3) continue

      const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]
      const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]

      records.push({
        id: recordId++,
        student_id: student.id,
        student,
        subject_id: subject.id,
        subject_name: subject.name,
        classroom_id: classroomId,
        classroom_name:
          CLASSROOMS.find((c) => c.id === classroomId)?.name || '',
        date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        time_start: '07:00:00',
        time_end: '08:30:00',
        room_name: `Ruang ${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
        status,
        description: status !== 'present' ? `Keterangan ${status}` : null,
        created_at: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T07:00:00Z`,
        updated_at: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T07:00:00Z`,
      })
    }
  }

  return records
}

function computeSummary(records: IAttendanceRecord[]): IAttendanceSummary {
  const studentIds = new Set(records.map((r) => r.student_id))
  const totalStudents = studentIds.size

  const counts = records.reduce(
    (acc, r) => {
      acc[r.status]++
      return acc
    },
    { present: 0, permission: 0, sick: 0, absent: 0 } as Record<
      AttendanceStatus,
      number
    >,
  )

  const totalRecords = records.length
  const averageAttendance =
    totalRecords > 0 ? (counts.present / totalRecords) * 100 : 0

  return {
    total_students: totalStudents,
    average_attendance: Math.round(averageAttendance * 10) / 10,
    total_present: counts.present,
    total_permission: counts.permission,
    total_sick: counts.sick,
    total_absent: counts.absent,
  }
}

function computeStudentSummaries(
  records: IAttendanceRecord[],
): IStudentAttendanceSummary[] {
  const studentMap = new Map<number, IStudentAttendanceSummary>()

  for (const record of records) {
    const existing = studentMap.get(record.student_id)
    if (existing) {
      existing[record.status]++
      existing.total++
    } else {
      studentMap.set(record.student_id, {
        student_id: record.student_id,
        student_name: record.student.user.name,
        student_nis: record.student.user.identity_number,
        present: record.status === 'present' ? 1 : 0,
        permission: record.status === 'permission' ? 1 : 0,
        sick: record.status === 'sick' ? 1 : 0,
        absent: record.status === 'absent' ? 1 : 0,
        total: 1,
        attendance_rate: 0,
      })
    }
  }

  for (const summary of studentMap.values()) {
    summary.attendance_rate =
      summary.total > 0
        ? Math.round((summary.present / summary.total) * 1000) / 10
        : 0
  }

  return Array.from(studentMap.values())
}

function filterRecords(
  records: IAttendanceRecord[],
  params: IAttendanceParams,
): IAttendanceRecord[] {
  let filtered = [...records]

  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.student.user.name.toLowerCase().includes(search) ||
        r.student.user.identity_number.includes(search),
    )
  }

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((r) => r.status === params.status)
  }

  if (params.sortBy) {
    filtered.sort((a, b) => {
      let aVal: string | number = a[params.sortBy as keyof IAttendanceRecord] as
        | string
        | number
      let bVal: string | number = b[params.sortBy as keyof IAttendanceRecord] as
        | string
        | number
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      const order = params.order === 'desc' ? -1 : 1
      return aVal > bVal ? order : aVal < bVal ? -order : 0
    })
  }

  return filtered
}

function paginateRecords(
  records: IAttendanceRecord[],
  page: number,
  perPage: number,
): { items: IAttendanceRecord[]; meta: IAttendanceListResult['meta'] } {
  const total = records.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage
  return {
    items: records.slice(start, end),
    meta: { page, per_page: perPage, total, total_pages: totalPages },
  }
}

const CLASSROOM_RECORDS_CACHE = new Map<string, IAttendanceRecord[]>()

function getCacheKey(
  classroomId: number,
  month: number,
  semester: string,
): string {
  return `${classroomId}-${month}-${semester}`
}

function getOrGenerateRecords(
  classroomId: number,
  month: number,
  semester: string,
): IAttendanceRecord[] {
  const key = getCacheKey(classroomId, month, semester)
  if (!CLASSROOM_RECORDS_CACHE.has(key)) {
    CLASSROOM_RECORDS_CACHE.set(
      key,
      generateMockRecords(classroomId, month, semester),
    )
  }
  const records = CLASSROOM_RECORDS_CACHE.get(key)
  if (!records) throw new Error('Records not found')
  return records
}

export async function getAttendanceRecords(
  params: IAttendanceParams,
): Promise<IAttendanceListResult> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const classroomId = Number(params.classroom_id) || 1
  const month = Number(params.month) || new Date().getMonth() + 1
  const semester = (params.semester as string) || 'ganjil'

  const allRecords = getOrGenerateRecords(classroomId, month, semester)
  const filtered = filterRecords(allRecords, params)
  const paginated = paginateRecords(
    filtered,
    params.page || 1,
    params.per_page || 10,
  )

  return paginated
}

export async function getAttendanceSummary(
  params: Pick<IAttendanceParams, 'classroom_id' | 'month' | 'semester'>,
): Promise<IAttendanceSummary> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const classroomId = Number(params.classroom_id) || 1
  const month = Number(params.month) || new Date().getMonth() + 1
  const semester = params.semester || 'ganjil'

  const records = getOrGenerateRecords(classroomId, month, semester)
  return computeSummary(records)
}

export async function getStudentAttendanceSummaries(
  params: IAttendanceParams,
): Promise<{
  items: IStudentAttendanceSummary[]
  meta: IAttendanceListResult['meta']
}> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  const classroomId = Number(params.classroom_id) || 1
  const month = Number(params.month) || new Date().getMonth() + 1
  const semester = params.semester || 'ganjil'

  const allRecords = getOrGenerateRecords(classroomId, month, semester)
  let filtered = computeStudentSummaries(allRecords)

  // Filter by status if selected
  if (params.status && params.status !== 'all') {
    const statusKey = params.status as
      | 'present'
      | 'permission'
      | 'sick'
      | 'absent'
    filtered = filtered.filter((s) => s[statusKey] > 0)
  }

  // Filter by search (student name or NIS)
  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.student_name.toLowerCase().includes(search) ||
        s.student_nis.includes(search),
    )
  }

  // Sort
  if (params.sortBy) {
    filtered.sort((a, b) => {
      let aVal: string | number = a[
        params.sortBy as keyof IStudentAttendanceSummary
      ] as string | number
      let bVal: string | number = b[
        params.sortBy as keyof IStudentAttendanceSummary
      ] as string | number
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      const order = params.order === 'desc' ? -1 : 1
      return aVal > bVal ? order : aVal < bVal ? -order : 0
    })
  }

  // Paginate
  const page = params.page || 1
  const perPage = params.per_page || 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    items: filtered.slice(start, end),
    meta: { page, per_page: perPage, total, total_pages: totalPages },
  }
}

export async function getStudentAttendanceDetail(
  studentId: number,
  params: Pick<IAttendanceParams, 'classroom_id' | 'month' | 'semester'>,
): Promise<IStudentAttendanceDetail> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  const classroomId = Number(params.classroom_id) || 1
  const month = Number(params.month) || new Date().getMonth() + 1
  const semester = params.semester || 'ganjil'

  const allRecords = getOrGenerateRecords(classroomId, month, semester)
  const studentRecords = allRecords.filter((r) => r.student_id === studentId)

  const student =
    studentRecords[0]?.student ?? MOCK_STUDENTS.find((s) => s.id === studentId)
  const summary = computeStudentSummaries(studentRecords)[0] || {
    student_id: student.id,
    student_name: student.user.name,
    student_nis: student.user.identity_number,
    present: 0,
    permission: 0,
    sick: 0,
    absent: 0,
    total: 0,
    attendance_rate: 0,
  }

  return {
    student,
    summary,
    records: studentRecords.sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export async function getClassOptions(): Promise<IClassOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return CLASSROOMS
}

export async function getMonthOptions(): Promise<IMonthOption[]> {
  return MONTHS
}

export async function getSemesterOptions(): Promise<ISemesterOption[]> {
  return SEMESTERS
}

export function clearAttendanceCache(): void {
  CLASSROOM_RECORDS_CACHE.clear()
}
