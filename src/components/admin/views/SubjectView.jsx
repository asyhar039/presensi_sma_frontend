import { SectionCard } from '../../SectionCard';

export function SubjectView({ items }) {
  return (
    <SectionCard title="Mata Pelajaran" icon="book-open">
      <div className="row g-3">
        {items && items.length > 0 ? items.map((item) => (
          <div className="col-md-4" key={item?.id || item?.kode_mapel}>
            <div className="p-3 rounded-3 border">
              <div className="fw-bold">{item?.nama_mapel || '-'}</div>
              <div className="text-muted small">Kode: {item?.kode_mapel || '-'}</div>
              <div className="text-muted small mt-2">Pengampu: {item?.guru_nama || '-'}</div>
            </div>
          </div>
        )) : <div className="text-muted">Belum ada data mata pelajaran</div>}
      </div>
    </SectionCard>
  );
}
