import { useMemo, useState } from "react";
import { MOCK_SITES } from "../mocks/sites";
import { MOCK_ALERTS } from "../mocks/alerts";
import { MOCK_PFAS_SPECIES } from "../mocks/pfassepcies";

export default function LabRegister() {
  const [siteQuery, setSiteQuery] = useState("");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [alertQuery, setAlertQuery] = useState("");
  const [alertId, setAlertId] = useState<string | null>(null);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [speciesId, setSpeciesId] = useState<string | null>(null);
  const [sampleTs, setSampleTs] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [method, setMethod] = useState("LC-MS/MS");
  const [conforms, setConforms] = useState<"ok" | "ng" | "">("");

  const siteResults = useMemo(() => {
    const q = siteQuery.trim().toLowerCase();
    if (!q) return [] as typeof MOCK_SITES;
    return MOCK_SITES.filter(s => String(s.id).toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 8);
  }, [siteQuery]);

  const alertResults = useMemo(() => {
    const q = alertQuery.trim().toLowerCase();
    if (!q) return [] as typeof MOCK_ALERTS;
    return MOCK_ALERTS.filter(a => String(a.id).toLowerCase().includes(q)).slice(0, 8);
  }, [alertQuery]);

  const speciesOptions = useMemo(() => MOCK_PFAS_SPECIES.map(s => ({ id: String(s.id), code: s.code })), []);

  const canSubmit = Boolean(siteId && alertId && speciesId && sampleTs && value && unit && method && conforms);

  function submit() {
    if (!canSubmit) return;
    const payload = {
      site_id: siteId!,
      alert_id: alertId!,
      species_id: speciesId!,
      sample_ts: sampleTs ? new Date(sampleTs).toISOString() : "",
      value,
      unit,
      method,
      conforms: conforms === "ok",
    };
    alert("등록 요청 미리보기\n" + JSON.stringify(payload, null, 2));
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">실험실 결과 등록</h3>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <label className="mb-1 block text-sm font-medium">사이트 선택</label>
          <div className="flex items-center gap-2">
            <input
              value={siteQuery}
              onChange={(e) => {
                setSiteQuery(e.target.value);
                setShowSiteDropdown(true);
                if (e.target.value === "") {
                  setSiteId(null);
                  setShowSiteDropdown(false);
                }
              }}
              onFocus={() => siteQuery && setShowSiteDropdown(true)}
              onBlur={() => setTimeout(() => setShowSiteDropdown(false), 200)}
              placeholder="Site ID/이름 검색"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 h-10"
            />
            <button className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50 h-10 whitespace-nowrap" onClick={() => { 
              setSiteQuery(""); 
              setSiteId(null); 
              setShowSiteDropdown(false);
            }}>초기화</button>
          </div>
          {showSiteDropdown && siteQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border text-sm bg-white z-10 absolute w-full">
              {siteResults.map(s => (
                <li key={String(s.id)}>
                  <button 
                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 ${siteId === String(s.id) ? "bg-slate-50" : ""}`} 
                    onMouseDown={() => { 
                      setSiteId(String(s.id)); 
                      setSiteQuery(`${String(s.id)} • ${s.name}`); 
                      setShowSiteDropdown(false);
                    }}
                  >
                    {String(s.id)} • {s.name}
                  </button>
                </li>
              ))}
              {siteResults.length === 0 && (<li className="px-3 py-2 text-slate-500">검색 결과 없음</li>)}
            </ul>
          )}
          {siteId && (<p className="mt-1 text-xs text-slate-500">선택됨: {siteQuery}</p>)}
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-medium">알림 선택</label>
          <div className="flex items-center gap-2">
            <input
              value={alertQuery}
              onChange={(e) => {
                setAlertQuery(e.target.value);
                setShowAlertDropdown(true);
                if (e.target.value === "") {
                  setAlertId(null);
                  setShowAlertDropdown(false);
                }
              }}
              onFocus={() => alertQuery && setShowAlertDropdown(true)}
              onBlur={() => setTimeout(() => setShowAlertDropdown(false), 200)}
              placeholder="Alarm ID 검색 (예: AL-001)"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 h-10"
            />
            <button className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50 h-10 whitespace-nowrap" onClick={() => { 
              setAlertQuery(""); 
              setAlertId(null); 
              setShowAlertDropdown(false);
            }}>초기화</button>
          </div>
          {showAlertDropdown && alertQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border text-sm bg-white z-10 absolute w-full">
              {alertResults.map(a => (
                <li key={String(a.id)}>
                  <button 
                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 ${alertId === String(a.id) ? "bg-slate-50" : ""}`} 
                    onMouseDown={() => { 
                      setAlertId(String(a.id)); 
                      setAlertQuery(String(a.id)); 
                      setShowAlertDropdown(false);
                    }}
                  >
                    {String(a.id)} • {new Date(a.ts).toLocaleString()} • Sensor {String(a.sensor_id)}
                  </button>
                </li>
              ))}
              {alertResults.length === 0 && (<li className="px-3 py-2 text-slate-500">검색 결과 없음</li>)}
            </ul>
          )}
          {alertId && (<p className="mt-1 text-xs text-slate-500">선택됨: {alertId}</p>)}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">PFAS 종 선택</label>
          <select
            value={speciesId ?? ""}
            onChange={(e) => setSpeciesId(e.target.value || null)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">종 선택</option>
            {speciesOptions.map(sp => (
              <option key={sp.id} value={sp.id}>{sp.code} ({sp.id})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">채취 시각</label>
          <input
            type="datetime-local"
            step={3600}
            value={sampleTs}
            onChange={(e) => setSampleTs(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">값 (value)</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="예: 4.21"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">단위 (unit)</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="예: ng/L"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">방법 (method)</label>
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="예: LC-MS/MS"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">판정 (conforms)</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="conforms" checked={conforms === "ok"} onChange={() => setConforms("ok")} />
              정상(기준 이내)
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="conforms" checked={conforms === "ng"} onChange={() => setConforms("ng")} />
              초과(기준 초과)
            </label>
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={!canSubmit}
            onClick={submit}
            className={`w-full rounded-md px-4 py-2 text-sm font-medium ${canSubmit ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-500"}`}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
