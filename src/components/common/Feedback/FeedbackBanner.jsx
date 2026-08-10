export function FeedbackBanner({ message }) {
  if (!message) return null;
  return <div className="alert alert-info mb-3">{message}</div>;
}
