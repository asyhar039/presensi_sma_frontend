import { presenceCompositionData } from '../../../mocks/dashboardMock';

const PresenceComposition = ({ data = presenceCompositionData }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="rounded-lg border border-card-border bg-card-bg shadow-sm px-4 py-4">
      <div className="border-b border-slate-100 pb-2">
        <h5 className="mb-0.5 font-bold text-dark">Komposisi Presensi</h5>
        <p className="mb-0 text-xs text-muted">Distribusi status kehadiran hari ini</p>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label="Komposisi presensi hari ini">
        {data.map((item) => (
          <div
            key={item.key}
            className="h-full"
            style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
            aria-label={`${item.label}: ${item.value}%`}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {data.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-3 flex-shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="truncate text-muted">{item.label}</span>
            </div>
            <span className="font-semibold text-dark">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { PresenceComposition };
export default PresenceComposition;