import { useMemo, useState } from "react";
import type { Sensor } from "../types/db";
import { MOCK_SENSORS } from "../mocks/sensors";
import { MOCK_MEASUREMENTS } from "../mocks/measurements";
import { MOCK_SITES } from "../mocks/sites";
import { MOCK_PFAS_SPECIES } from "../mocks/pfassepcies";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type ViewSensor = {
    id: string;
    serial: string;
    name: string; // site name
    raw: Sensor;
};

export default function SensorTimeSeries() {
    const [q, setQ] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // join sensor with site name
    const dataset: ViewSensor[] = useMemo(() => {
        const siteById = new Map(MOCK_SITES.map((s) => [String(s.id), s]));
        return MOCK_SENSORS.map((s) => ({
            id: String(s.id),
            serial: s.serial_no,
            name: siteById.get(String(s.site_id))?.name ?? s.model,
            raw: s,
        }));
    }, []);

    // search priority: id/serial -> name
    const results = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return dataset;
        const idHits = dataset.filter(
            (s) => s.id.toLowerCase().includes(query) || s.serial.toLowerCase().includes(query)
        );
        return idHits.length ? idHits : dataset.filter((s) => s.name.toLowerCase().includes(query));
    }, [q, dataset]);

    const selected = useMemo(
        () => dataset.find((s) => s.id === selectedId) ?? null,
        [selectedId, dataset]
    );

    // build time-series for selected sensor: pivot by ts -> { ts, tsMs, SP-001: v, ... }
    // also collect units per species for tooltip display
    const { seriesKeys, chartData, unitsByKey } = useMemo(() => {
        if (!selected) return { seriesKeys: [] as string[], chartData: [] as any[], unitsByKey: {} as Record<string, string> };
        const rows = MOCK_MEASUREMENTS.filter((m) => String(m.sensor_id) === selected.id);
        const byTs = new Map<string, Record<string, number | string>>();
        const keys = new Set<string>();
        const units: Record<string, string> = {};
        for (const m of rows) {
            const ts = m.ts;
            const sp = String(m.species_id);
            keys.add(sp);
            const rec = byTs.get(ts) ?? { ts, tsMs: Date.parse(ts) } as Record<string, number | string>;
            (rec as any)[sp] = m.value;
            byTs.set(ts, rec);
            if (!units[sp]) units[sp] = m.unit;
        }
        const data = Array.from(byTs.values()).sort(
            (a, b) => Date.parse(String(a.ts)) - Date.parse(String(b.ts))
        );
        return { seriesKeys: Array.from(keys).sort(), chartData: data, unitsByKey: units };
    }, [selected]);

    // toggles for species
    const [enabled, setEnabled] = useState<Record<string, boolean>>({});
    const effectiveEnabled = useMemo(() => {
        // default all true if not set
        if (!seriesKeys.length) return {} as Record<string, boolean>;
        const next: Record<string, boolean> = { ...enabled };
        for (const k of seriesKeys) if (next[k] === undefined) next[k] = true;
        return next;
    }, [seriesKeys, enabled]);

    const toggle = (k: string) => setEnabled((p) => ({ ...p, [k]: !effectiveEnabled[k] }));

    const colors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#059669"]; // blue, green, amber, red, violet, emerald

    // species id -> code label
    const codeById = useMemo(() => {
        const m: Record<string, string> = {};
        for (const s of MOCK_PFAS_SPECIES) m[String(s.id)] = s.code;
        return m;
    }, []);
    const labelOf = (id: string) => codeById[id] ?? id;

    // keep legend order consistent with toggles/lines (custom content below)

    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-semibold">센서 검색 및 시계열 분석</h3>

            {/* Search + results */}
            <div className="mb-3 flex items-center gap-2">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="센서 ID/일련번호/이름 검색"
                    className="w-full h-10 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                    onClick={() => { setQ(""); setSelectedId(null); }}
                    disabled={!q && !selectedId}
                    className={`h-10 min-w-[72px] rounded-md border px-3 text-sm ${q || selectedId ? "bg-white hover:bg-slate-50" : "bg-white opacity-40 cursor-not-allowed"}`}
                >초기화</button>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="rounded-lg border p-2 max-h-64 overflow-auto">
                    <ul className="space-y-1 text-sm">
                        {results.map((s) => (
                            <li key={s.id}>
                                <button
                                    onClick={() => setSelectedId(s.id)}
                                    className={`w-full rounded-md border px-3 py-2 text-left hover:bg-slate-50 ${selectedId === s.id ? "ring-2 ring-blue-300" : ""}`}
                                >
                                    <div className="font-medium">{s.name}</div>
                                    <div className="text-xs text-slate-500">ID: {s.id} • Serial: {s.serial}</div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* toggles + chart */}
                <div className="md:col-span-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {seriesKeys.length === 0 && (
                            <div className="text-sm text-slate-500">센서를 선택하면 시계열 그래프가 표시됩니다.</div>
                        )}
                        {seriesKeys.map((k, i) => (
                            <label key={k} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm">
                                <input type="checkbox" checked={!!effectiveEnabled[k]} onChange={() => toggle(k)} />
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
                                    {labelOf(k)}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-3 h-[360px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="tsMs"
                                    type="number"
                                    scale="time"
                                    domain={["auto", "auto"]}
                                    tickFormatter={(v) => new Date(v as number).toLocaleTimeString()}
                                    minTickGap={24}
                                />
                                <YAxis tickMargin={8} />
                                <Tooltip
                                    content={({ active, label, payload }) => {
                                        if (!active || !payload || payload.length === 0) return null;
                                        const timeLabel = new Date(Number(label)).toLocaleString();
                                        return (
                                            <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm">
                                                <div className="mb-1 font-medium">{timeLabel}</div>
                                                {payload.map((p: any, idx: number) => {
                                                    const unit = unitsByKey[String(p.dataKey)] ?? "";
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.color }} />
                                                            <span>{labelOf(String(p.dataKey))}</span>
                                                            <span className="ml-auto tabular-nums">{p.value}</span>
                                                            {unit && <span className="ml-1 text-slate-500">{unit}</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }}
                                />
                                <Legend content={() => (
                                    <div className="flex items-center justify-center gap-6 text-sm pt-2">
                                        {seriesKeys.map((k, i) => (
                                            <div key={`legend-${k}`} className="inline-flex items-center gap-2">
                                                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
                                                <span className="font-medium" style={{ color: colors[i % colors.length] }}>{labelOf(k)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )} />
                                {seriesKeys.map((k, i) => (
                                    effectiveEnabled[k] ? (
                                        <Line
                                            key={k}
                                            type="linear"
                                            dataKey={k}
                                            name={labelOf(k)}
                                            stroke={colors[i % colors.length]}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                            connectNulls
                                        />
                                    ) : null
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
