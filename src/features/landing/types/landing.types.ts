export type LandingPageId =
  | 'beranda'
  | 'panduan'
  | 'tentang'
  | 'pengembang'
  | 'bantuan'

export interface NavItem {
  id: LandingPageId
  label: string
}

export interface TeamMemberBadge {
  text: string
  variant: 'light' | 'dark'
}

export interface TeamMember {
  name: string
  image: string
  badges: TeamMemberBadge[]
  description: string
}
