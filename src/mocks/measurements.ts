import type { Measurement } from "../types/db";

/**
 * 1~3시간 간격의 과거 타임스탬프 배열을 생성합니다.
 * 예: [0, 2, 5, 7, 9] (현재 시각, -2h, -5h ...)
 */
function hoursBackSequence(count = 6): number[] {
  const seq = [0];
  for (let i = 1; i < count; i++) {
    const gap = 1 + Math.floor(Math.random() * 3); // 1~3시간 랜덤
    seq.push(seq[i - 1] + gap);
  }
  return seq;
}

const NOW = new Date();
const toIsoMinusHours = (h: number) =>
  new Date(NOW.getTime() - h * 3600_000).toISOString();

/**
 * 하나의 sensorId에 대해 N개의 measurement를 생성합니다.
 * speciesId는 PFAS 종 코드(PFOS: SP-001 등).
 */
function makeSeries(params: {
  sensorId: string;     // SensorId (브랜딩 타입이면 as any로 단언)
  speciesId: string;    // SpeciesId (브랜딩 타입이면 as any로 단언)
  base: number;         // 기준 농도 (ng/L)
  unit?: string;        // 기본 'ng/L'
  count?: number;       // 생성 개수 (기본 6)
}): Measurement[] {
  const { sensorId, speciesId, base, unit = "ng/L", count = 6 } = params;
  const hoursSeq = hoursBackSequence(count);

  // 다이나믹 변동: 완만한 주기 + 랜덤 워크 + 노이즈
  let walk = (Math.random() - 0.5) * 0.6; // 초기 오프셋

  return hoursSeq.map((h, i) => {
    const trend = Math.sin(i / 5) * 0.7;        // 주기적 변화(±0.7)
    walk += (Math.random() - 0.5) * 0.3;        // 랜덤 워크 스텝(±0.15 평균)
    const noise = (Math.random() - 0.5) * 0.15; // 미세 노이즈(±0.075)
    const value = Number((base + trend + walk + noise).toFixed(2));

    return {
      ts: toIsoMinusHours(h),
      sensor_id: sensorId as any,
      species_id: speciesId as any,
      value,
      unit,
      temp_c: Number((14 + Math.random() * 10).toFixed(1)),   // 14~24℃
      flow_cms: Number((0.2 + Math.random() * 0.8).toFixed(2)), // 0.2~1.0 CMS
      quality: { method: "online", flag: "ok" },
    };
  });
}

export const MOCK_MEASUREMENTS: Measurement[] = [
  // SN-001: 4종 × 7개 = 28
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-001", base: 3.2, count: 7 }),
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-002", base: 1.1, count: 7 }),
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-003", base: 0.5, count: 7 }),

  // SN-002: 4종 × 6개 = 24
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-001", base: 2.8, count: 6 }),
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-002", base: 1.3, count: 6 }),
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-003", base: 0.4, count: 6 }),

  // SN-003: 4종 × 6개 = 24
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-001", base: 4.1, count: 6 }),
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-002", base: 1.5, count: 6 }),
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-003", base: 0.6, count: 6 }),

  // SN-004: 4종 × 6개 = 24
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-001", base: 4.1, count: 6 }),
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-002", base: 3.5, count: 6 }),
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-003", base: 0.9, count: 6 }),
];
