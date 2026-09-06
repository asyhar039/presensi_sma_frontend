import ResetPasswordModal from '../../../components/feedback/ResetPasswordModal';

export default function StudentResetPasswordModalWrapper({ student, ...props }) {
  return <ResetPasswordModal {...props} user={student} entityName="Siswa" />;
}
