import { useMemo, useState } from "react";
import type { Measurement, Sensor } from "../types/db";
import { MOCK_SENSORS } from "../mocks/sensors";
import { MOCK_MEASUREMENTS } from "../mocks/measurements";
import { MOCK_SITES } from "../mocks/sites";
import { MOCK_STANDARDS } from "../mocks/standards";
import { MOCK_PFAS_SPECIES } from "../mocks/pfassepcies";

type ViewSensor = {
  id: string;           // SensorId as string
  serial: string;       // serial_no
  name: string;         // site name
  site_id: string;
  raw: Sensor;
};

export default function SensorSearch() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 센서 + 사이트 이름 join
  const dataset: ViewSensor[] = useMemo(() => {
    const siteById = new Map(MOCK_SITES.map(s => [String(s.id), s]));
    return MOCK_SENSORS.map(s => {
      const site = siteById.get(String(s.site_id));
      return {
        id: String(s.id),
        serial: s.serial_no,
        name: site?.name ?? s.model,
        site_id: String(s.site_id),
        raw: s,
      };
    });
  }, []);

  // 검색: 1) id/serial 매칭, 없으면 2) name 매칭
  const results: ViewSensor[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const idHits = dataset.filter(s => s.id.toLowerCase().includes(query) || s.serial.toLowerCase().includes(query));
    if (idHits.length) return idHits;
    return dataset.filter(s => s.name.toLowerCase().includes(query));
  }, [q, dataset]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return dataset.find(s => s.id === selectedId) ?? null;
  }, [selectedId, dataset]);

  // species id -> code label
  const codeById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const sp of MOCK_PFAS_SPECIES) m[String(sp.id)] = sp.code;
    return m;
  }, []);
  const labelOf = (id: string) => codeById[id] ?? id;

  // species별 우선 기준(음용수 > 기타) 선택
  const standardBySpecies = useMemo(() => {
    const bySpecies = new Map<string, { drinking?: any; other?: any }>();
    for (const st of MOCK_STANDARDS) {
      const key = String(st.species_id);
      const bucket = bySpecies.get(key) ?? {};
      if (st.basis === "drinking_water") bucket.drinking = st; else bucket.other = bucket.other ?? st;
      bySpecies.set(key, bucket);
    }
    const pick = new Map<string, any>();
    for (const [k, v] of bySpecies) pick.set(k, v.drinking ?? v.other);
    return pick;
  }, []);

  // 선택 센서의 최신 측정값(종별 최신 ts)
  const latestBySpecies: { species_id: string; value: number; unit: string; ts: string; threshold?: number; ok?: boolean }[] = useMemo(() => {
    if (!selected) return [];
    const rows = MOCK_MEASUREMENTS.filter(m => String(m.sensor_id) === selected.id);
    const map = new Map<string, Measurement>();
    for (const m of rows) {
      const key = String(m.species_id);
      const prev = map.get(key);
      if (!prev || Date.parse(m.ts) > Date.parse(prev.ts)) map.set(key, m);
    }
    return Array.from(map.values()).map(m => {
      const st = standardBySpecies.get(String(m.species_id));
      const th = st?.mcl as number | undefined;
      const ok = typeof th === "number" ? m.value <= th : undefined;
      return { species_id: String(m.species_id), value: m.value, unit: m.unit, ts: m.ts, threshold: th, ok };
    }).sort((a, b) => a.species_id.localeCompare(b.species_id));
  }, [selected, standardBySpecies]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm h-full flex flex-col min-h-0">
      <h3 className="mb-3 font-semibold">센서 검색 & 현재 데이터</h3>

      {/* 검색 입력 */}
      <div className="mb-3 flex items-center gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full h-10 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="검색어 입력 (일련번호 → 이름 순 검색)"
        />
        <button
          onClick={() => { setQ(""); setSelectedId(null); }}
          disabled={!q}
          className={`h-10 min-w-[72px] whitespace-nowrap rounded-md border px-3 text-sm ${q ? "bg-white hover:bg-slate-50" : "bg-white opacity-40 cursor-not-allowed"}`}
        >
          초기화
        </button>
      </div>

      {/* 결과 박스: 선택 시 높이를 절반 정도로 축소 */}
      <div className={`${selected ? "flex-[0.5]" : "flex-1"} overflow-hidden min-h-0`}>
        <div className="h-full overflow-y-auto rounded-lg border p-2">
          {q.trim() === "" ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">검색어를 입력하세요</div>
          ) : results.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">검색 결과가 없습니다</div>
          ) : (
            <ul className="grid gap-2">
              {results.map(s => (
                <li key={s.id}>
                  <button
                    className={`w-full rounded-md border px-3 py-2 text-left hover:bg-slate-50 ${selectedId === s.id ? "ring-2 ring-blue-300" : ""}`}
                    onClick={() => setSelectedId(s.id)}
                  >
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">ID: {s.id} • Serial: {s.serial}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 선택 센서 최신 값 */}
      {selected && (
        <div className="mt-3 shrink-0">
          <div className="text-xs text-slate-500">선택 센서</div>
          <div className="text-sm font-semibold">{selected.name} <span className="ml-2 text-xs font-normal text-slate-500">{selected.id}</span></div>
          {latestBySpecies.length > 0 ? (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {latestBySpecies.map(x => (
                <Metric
                  key={x.species_id}
                  title={labelOf(x.species_id)}
                  unit={x.unit}
                  value={x.value}
                  threshold={x.threshold}
                  ok={x.ok}
                  ts={x.ts}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 text-xs text-slate-500">최근 측정값이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ title, unit, value, threshold, ok, ts }: { title: string; unit: string; value: number; threshold?: number; ok?: boolean; ts?: string; }) {
  return (
    <div className="rounded-lg border bg-white px-3 py-2">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-semibold">{value.toFixed(2)} <span className="text-xs font-normal text-slate-500">{unit}</span></div>
      {ts && (
        <div className="mt-1 text-[11px] text-slate-500">{new Date(ts).toLocaleString()}</div>
      )}
      {threshold !== undefined && (
        <div className="mt-1 text-xs">
          기준치: {threshold} {unit}
          {ok !== undefined && (
            <span className={`ml-2 font-semibold ${ok ? "text-emerald-600" : "text-red-600"}`}>{ok ? "정상" : "위험"}</span>
          )}
        </div>
      )}
    </div>
  );
}
