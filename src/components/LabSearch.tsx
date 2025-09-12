import { useMemo, useState } from "react";
import { MOCK_LAB_CONFIRMATIONS } from "../mocks/labconfirmations";
import { MOCK_SITES } from "../mocks/sites";
import { MOCK_PFAS_SPECIES } from "../mocks/pfassepcies";
import { MOCK_SENSORS } from "../mocks/sensors";

export default function LabSearch() {
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [selectedSpecies, setSelectedSpecies] = useState<Set<string>>(new Set());
  const [selectedSensors, setSelectedSensors] = useState<Set<string>>(new Set());
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  // 검색 상태
  const [siteQuery, setSiteQuery] = useState("");
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [sensorQuery, setSensorQuery] = useState("");
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [showSensorDropdown, setShowSensorDropdown] = useState(false);

  // 검색 결과
  const siteResults = useMemo(() => {
    const q = siteQuery.trim().toLowerCase();
    if (!q) return [] as typeof MOCK_SITES;
    return MOCK_SITES.filter(s => 
      String(s.id).toLowerCase().includes(q) || 
      s.name.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [siteQuery]);

  const speciesResults = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    if (!q) return [] as typeof MOCK_PFAS_SPECIES;
    return MOCK_PFAS_SPECIES.filter(s => 
      String(s.id).toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [speciesQuery]);

  const sensorResults = useMemo(() => {
    const q = sensorQuery.trim().toLowerCase();
    if (!q) return [] as typeof MOCK_SENSORS;
    return MOCK_SENSORS.filter(s => 
      String(s.id).toLowerCase().includes(q) || 
      s.serial_no.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [sensorQuery]);

  // 필터링된 결과
  const filteredRecords = useMemo(() => {
    return MOCK_LAB_CONFIRMATIONS.filter(record => {
      const siteMatch = selectedSites.size === 0 || selectedSites.has(String(record.site_id));
      const speciesMatch = selectedSpecies.size === 0 || selectedSpecies.has(String(record.species_id));
      
      // sensor는 alert를 통해 간접적으로 연결 (실제 구현에서는 alert -> sensor 매핑 필요)
      // 임시로 모든 sensor 선택을 허용
      const sensorMatch = selectedSensors.size === 0 || true;
      
      return siteMatch && speciesMatch && sensorMatch;
    });
  }, [selectedSites, selectedSpecies, selectedSensors]);

  // 선택된 레코드의 세부 정보
  const selectedRecordDetail = useMemo(() => {
    if (!selectedRecord) return null;
    return MOCK_LAB_CONFIRMATIONS.find(record => String(record.id) === selectedRecord);
  }, [selectedRecord]);

  // 선택 핸들러
  const addSite = (siteId: string, siteName: string) => {
    const newSet = new Set(selectedSites);
    newSet.add(siteId);
    setSelectedSites(newSet);
    setSiteQuery("");
    setShowSiteDropdown(false);
  };

  const removeSite = (siteId: string) => {
    const newSet = new Set(selectedSites);
    newSet.delete(siteId);
    setSelectedSites(newSet);
  };

  const addSpecies = (speciesId: string, speciesCode: string) => {
    const newSet = new Set(selectedSpecies);
    newSet.add(speciesId);
    setSelectedSpecies(newSet);
    setSpeciesQuery("");
    setShowSpeciesDropdown(false);
  };

  const removeSpecies = (speciesId: string) => {
    const newSet = new Set(selectedSpecies);
    newSet.delete(speciesId);
    setSelectedSpecies(newSet);
  };

  const addSensor = (sensorId: string) => {
    const newSet = new Set(selectedSensors);
    newSet.add(sensorId);
    setSelectedSensors(newSet);
    setSensorQuery("");
    setShowSensorDropdown(false);
  };

  const removeSensor = (sensorId: string) => {
    const newSet = new Set(selectedSensors);
    newSet.delete(sensorId);
    setSelectedSensors(newSet);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm h-full overflow-auto">
      <h3 className="mb-3 font-semibold">실험실 결과 검색</h3>
      
      {/* 필터 섹션 - 수평 레이아웃 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Site 검색 */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium">사이트</label>
          <input
            value={siteQuery}
            onChange={(e) => {
              setSiteQuery(e.target.value);
              setShowSiteDropdown(true);
              if (e.target.value === "") {
                setShowSiteDropdown(false);
              }
            }}
            onFocus={() => siteQuery && setShowSiteDropdown(true)}
            onBlur={() => setTimeout(() => setShowSiteDropdown(false), 200)}
            placeholder="사이트 검색"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 h-10"
          />
          {showSiteDropdown && siteQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border text-sm bg-white z-10 absolute w-full">
              {siteResults.map(s => (
                <li key={String(s.id)}>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-slate-50"
                    onMouseDown={() => addSite(String(s.id), s.name)}
                  >
                    {String(s.id)} • {s.name}
                  </button>
                </li>
              ))}
              {siteResults.length === 0 && (<li className="px-3 py-2 text-slate-500">검색 결과 없음</li>)}
            </ul>
          )}
          {/* 선택된 사이트들 */}
          {selectedSites.size > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(selectedSites).map(siteId => {
                const site = MOCK_SITES.find(s => String(s.id) === siteId);
                return (
                  <span key={siteId} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {site?.name || siteId}
                    <button 
                      onClick={() => removeSite(siteId)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* PFAS Species 검색 */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium">PFAS 종</label>
          <input
            value={speciesQuery}
            onChange={(e) => {
              setSpeciesQuery(e.target.value);
              setShowSpeciesDropdown(true);
              if (e.target.value === "") {
                setShowSpeciesDropdown(false);
              }
            }}
            onFocus={() => speciesQuery && setShowSpeciesDropdown(true)}
            onBlur={() => setTimeout(() => setShowSpeciesDropdown(false), 200)}
            placeholder="PFAS 종 검색"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 h-10"
          />
          {showSpeciesDropdown && speciesQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border text-sm bg-white z-10 absolute w-full">
              {speciesResults.map(s => (
                <li key={String(s.id)}>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-slate-50"
                    onMouseDown={() => addSpecies(String(s.id), s.code)}
                  >
                    {s.code} ({String(s.id)})
                  </button>
                </li>
              ))}
              {speciesResults.length === 0 && (<li className="px-3 py-2 text-slate-500">검색 결과 없음</li>)}
            </ul>
          )}
          {/* 선택된 종들 */}
          {selectedSpecies.size > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(selectedSpecies).map(speciesId => {
                const species = MOCK_PFAS_SPECIES.find(s => String(s.id) === speciesId);
                return (
                  <span key={speciesId} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    {species?.code || speciesId}
                    <button 
                      onClick={() => removeSpecies(speciesId)}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Sensor 검색 */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium">센서</label>
          <input
            value={sensorQuery}
            onChange={(e) => {
              setSensorQuery(e.target.value);
              setShowSensorDropdown(true);
              if (e.target.value === "") {
                setShowSensorDropdown(false);
              }
            }}
            onFocus={() => sensorQuery && setShowSensorDropdown(true)}
            onBlur={() => setTimeout(() => setShowSensorDropdown(false), 200)}
            placeholder="센서 검색"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200 h-10"
          />
          {showSensorDropdown && sensorQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border text-sm bg-white z-10 absolute w-full">
              {sensorResults.map(s => (
                <li key={String(s.id)}>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-slate-50"
                    onMouseDown={() => addSensor(String(s.id))}
                  >
                    {String(s.id)} • {s.serial_no}
                  </button>
                </li>
              ))}
              {sensorResults.length === 0 && (<li className="px-3 py-2 text-slate-500">검색 결과 없음</li>)}
            </ul>
          )}
          {/* 선택된 센서들 */}
          {selectedSensors.size > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(selectedSensors).map(sensorId => {
                const sensor = MOCK_SENSORS.find(s => String(s.id) === sensorId);
                return (
                  <span key={sensorId} className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {sensor?.id || sensorId}
                    <button 
                      onClick={() => removeSensor(sensorId)}
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 결과 목록 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">검색 결과 ({filteredRecords.length}개)</h4>
        
        {filteredRecords.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">검색 결과가 없습니다.</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-auto">
            {filteredRecords.map(record => (
              <button
                key={String(record.id)}
                onClick={() => setSelectedRecord(String(record.id))}
                className={`w-full p-3 text-left border rounded-lg transition-colors text-sm ${
                  selectedRecord === String(record.id)
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{String(record.id)}</div>
                <div className="text-gray-600 text-xs">
                  {new Date(record.sample_ts).toLocaleDateString()} • 
                  {record.value} {record.unit} • 
                  <span className={record.conforms ? "text-green-600" : "text-red-600"}>
                    {record.conforms ? "기준 이내" : "기준 초과"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 레코드 세부 정보 */}
      {selectedRecordDetail && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium mb-3">세부 정보</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">ID:</span> {String(selectedRecordDetail.id)}</div>
            <div><span className="font-medium">알람 ID:</span> {String(selectedRecordDetail.alert_id)}</div>
            <div><span className="font-medium">사이트 ID:</span> {String(selectedRecordDetail.site_id)}</div>
            <div><span className="font-medium">종 ID:</span> {String(selectedRecordDetail.species_id)}</div>
            <div><span className="font-medium">채취 시각:</span> {new Date(selectedRecordDetail.sample_ts).toLocaleString()}</div>
            <div><span className="font-medium">보고 시각:</span> {new Date(selectedRecordDetail.reported_ts).toLocaleString()}</div>
            <div><span className="font-medium">측정값:</span> {selectedRecordDetail.value} {selectedRecordDetail.unit}</div>
            <div><span className="font-medium">측정 방법:</span> {selectedRecordDetail.method}</div>
            <div>
              <span className="font-medium">판정:</span> 
              <span className={`ml-1 font-medium ${selectedRecordDetail.conforms ? "text-green-600" : "text-red-600"}`}>
                {selectedRecordDetail.conforms ? "기준 이내" : "기준 초과"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}