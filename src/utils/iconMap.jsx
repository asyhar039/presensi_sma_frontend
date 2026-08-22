import {
  User,
  PieChart,
  GraduationCap,
  Presentation,
  School,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Users,
  Book,
  Plus,
  Pencil,
  Trash2,
  Undo2,
  Info,
  TriangleAlert,
  ClipboardList,
  Search,
  X,
  ChevronDown,
  LogOut,
  ChartLine,
  Wrench,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

const ICON_MAP = {
  'user': User,
  'chart-pie': PieChart,
  'user-graduate': GraduationCap,
  'chalkboard-teacher': Presentation,
  'school': School,
  'book-open': BookOpen,
  'calendar-alt': CalendarDays,
  'clipboard-check': ClipboardCheck,
  'file-invoice': FileText,
  'users': Users,
  'user-check': UserCheck,
  'book': Book,
  'plus': Plus,
  'edit': Pencil,
  'trash': Trash2,
  'undo': Undo2,
  'info-circle': Info,
  'exclamation-triangle': TriangleAlert,
  'clipboard-list': ClipboardList,
  'search': Search,
  'times': X,
  'xmark': X,
  'chevron-down': ChevronDown,
  'graduation-cap': GraduationCap,
  'sign-out-alt': LogOut,
  'chart-line': ChartLine,
  'wrench': Wrench,
  'rotate': RotateCcw,
};

const RenderIcon = ({ name, className = 'h-5 w-5', ...props }) => {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return <Component className={className} {...props} />;
};

export default RenderIcon;
