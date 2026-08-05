// src/components/ui/ProgressBar.jsx
// Thin horizontal progress bar. Used to show file-upload progress,
// but generic enough for any 0–100 percentage.

function ProgressBar({ percent = 0 }) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary-600 transition-all duration-150" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default ProgressBar;
