export default function Loading({ label = 'Loading your experience' }) {
  return <div className="loading-state"><span className="spinner" /> <span>{label}</span></div>;
}
