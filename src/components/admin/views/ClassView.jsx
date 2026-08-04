import { SectionCard } from '../../SectionCard';

export function ClassView({ items }) {
  return (
    <SectionCard title="Data Kelas" icon="school">
      <div className="row g-3">
        {items && items.length > 0 ? items.map((item) => (
          <div className="col-md-4" key={item?.id || item?.nama_kelas}>
            <div className="p-3 rounded-3 border">
              <div className="fw-bold">{item?.nama_kelas || '-'}</div>
              <div className="text-muted small">{item?.tingkat || '-'} - {item?.jurusan || 'Umum'}</div>
              <div className="text-muted small mt-2">Wali Kelas: {item?.guru_nama || '-'}</div>
            </div>
          </div>
        )) : <div className="text-muted">Belum ada data kelas</div>}
      </div>
    </SectionCard>
  );
}
