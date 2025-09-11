// src/components/SensorMap.tsx
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Sensor } from "../types/db";
import { MOCK_SENSORS } from "../mocks/sensors";

// 센서 범위에 맞춰 한 번만 자동 줌/이동
function FitToSensors({ sensors }: { sensors: Sensor[] }) {
    const map = useMap();
    const once = useRef(false);

    useEffect(() => {
        if (once.current || sensors.length === 0) return;
        const bounds = L.latLngBounds(sensors.map(s => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [24, 24] });
        once.current = true;
    }, [sensors, map]);

    return null;
}

// 상태별 색
function colorByStatus(status: Sensor["status"]) {
    switch (status) {
        case "active": return "#10b981";   // emerald-500
        case "repair": return "#f59e0b";   // amber-500
        case "inactive":
        default: return "#94a3b8";  // slate-400
    }
}

export default function SensorMap() {
    // 모의 데이터 로딩 (실서비스에서는 props로 넘겨받는 것을 권장)
    const sensors: Sensor[] = MOCK_SENSORS;

    const markers = useMemo(() => sensors.map(s => ({
        ...s,
        color: colorByStatus(s.status),
        radius: 10, // 필요 시 metric/위험도에 따라 조절 가능
    })), [sensors]);

    // 대한민국 대략 중심 (초기 렌더용)
    const center: [number, number] = [36.5, 127.8];

    return (
        <div className="relative z-0 rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">지도 기반 센서 현황</h3>

            <MapContainer
                center={center}
                zoom={7}
                minZoom={5}
                maxZoom={18}
                scrollWheelZoom
                className="h-[606px] md:h-[680px] lg:h-[744px] w-full rounded-xl"
                worldCopyJump={false}
            >
                {/* OSM 기본 타일 · 필요 시 MapTiler/Carto 스타일로 교체 */}
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 스케일바 */}
                <ScaleControl />

                {/* 센서들 범위로 자동 맞추기 */}
                <FitToSensors sensors={sensors} />

                {markers.map((s) => (
                    <CircleMarker
                        key={s.id as unknown as string}
                        center={[s.latitude, s.longitude]}
                        radius={s.radius}
                        pathOptions={{ color: s.color, weight: 2, fillOpacity: 0.6 }}
                    >
                        <Popup>
                            <div className="text-sm">
                                <div className="font-medium">{s.model} · {s.serial_no}</div>
                                <div className="text-slate-500">{String(s.id)} • site {String(s.site_id)}</div>
                                <div className="mt-1">
                                    위치: {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                                </div>
                                <div>상태: <b>{s.status}</b> / 통신: {s.comms}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    설치: {new Date(s.install_at).toLocaleString()}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <p className="mt-2 text-xs text-slate-500">
                휠로 확대/축소, 마커 클릭 시 상세 정보 확인
            </p>
        </div>
    );
}

/** Leaflet 스케일 컨트롤 부착 */
function ScaleControl() {
    const map = useMap();
    useEffect(() => {
        const ctrl = L.control.scale({ imperial: false }) as L.Control.Scale;
        ctrl.addTo(map);
        return () => { ctrl.remove(); };
    }, [map]);
    return null;
}
