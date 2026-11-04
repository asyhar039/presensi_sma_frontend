import type { TeamMember } from '../types/landing.types'

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Abdur Rohim',
    image: '/AbdurRohim.svg',
    badges: [
      { text: 'Ketua', variant: 'light' },
      { text: 'Front End Developer', variant: 'dark' },
    ],
    description:
      'Memimpin koordinasi proyek secara keseluruhan; mengembangkan antarmuka pengguna (front-end) aplikasi.',
  },
  {
    name: 'Robertus Adi Setiawan',
    image: '/RobertusAdiSetiawan.svg',
    badges: [
      { text: 'Wakil Ketua', variant: 'light' },
      { text: 'DevOps', variant: 'dark' },
    ],
    description:
      'Mendampingi ketua dalam pengambilan keputusan; mengelola infrastruktur dan proses deployment aplikasi.',
  },
  {
    name: 'Triana Elisabet Sinaga',
    image: '/TrianaElisabetSinaga.svg',
    badges: [{ text: 'Sekretaris', variant: 'light' }],
    description: 'Mendokumentasikan hasil diskusi dan perkembangan proyek.',
  },
  {
    name: 'Siti Munfarida',
    image: '/SitiMunfarida.svg',
    badges: [{ text: 'Bendahara', variant: 'light' }],
    description: 'Mengelola kebutuhan anggaran dan pencatatan keuangan proyek.',
  },
  {
    name: 'Ashar Qowim',
    image: '/AsharQowim.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'DevOps', variant: 'dark' },
    ],
    description:
      'Mendukung pengelolaan infrastruktur dan proses deployment aplikasi.',
  },
  {
    name: 'Maswa Arbaurnika',
    image: '/MaswaArbaurnika.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'Back End Developer', variant: 'dark' },
    ],
    description:
      'Mengembangkan sistem back-end, basis data, dan logika presensi berbasis QR Code.',
  },
  {
    name: 'Resa Martyaningsih',
    image: '/ResaMartyaningsih.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'UI/UX', variant: 'dark' },
    ],
    description:
      'Merancang alur dan tampilan antarmuka aplikasi agar mudah digunakan oleh guru dan siswa.',
  },
  {
    name: 'Septania Salihati',
    image: '/SeptaniaSalihati.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'UI/UX', variant: 'dark' },
    ],
    description:
      'Merancang alur dan tampilan antarmuka aplikasi agar mudah digunakan oleh guru dan siswa.',
  },
]
