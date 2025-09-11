import type { Measurement } from "../types/db";

/**
 * 3~4시간 간격의 과거 타임스탬프 배열을 생성합니다.
 * 예: [0, 3, 7, 10, 14] (현재 시각, -3h, -7h, -10h, -14h)
 */
function hoursBackSequence(count = 5): number[] {
  const seq = [0];
  for (let i = 1; i < count; i++) {
    const gap = 3 + Math.round(Math.random()); // 3 또는 4시간
    seq.push(seq[i - 1] + gap);
  }
  return seq;
}

const NOW = new Date();
const toIsoMinusHours = (h: number) =>
  new Date(NOW.getTime() - h * 3600_000).toISOString();

/**
 * 하나의 sensorId에 대해 5개의 measurement를 생성합니다.
 * speciesId는 PFOS 등 단일 종으로 고정(PFOS: SP-001)하거나 원하는 값으로 바꿔도 됩니다.
 */
function makeSeries(params: {
  sensorId: string;     // SensorId (브랜딩 타입이면 as any로 단언)
  speciesId: string;    // SpeciesId (브랜딩 타입이면 as any로 단언)
  base: number;         // 기준 농도 (ng/L)
  unit?: string;        // 기본 'ng/L'
}): Measurement[] {
  const { sensorId, speciesId, base, unit = "ng/L" } = params;
  const hoursSeq = hoursBackSequence(5); // 총 5개
  return hoursSeq.map((h, i) => {
    // 작은 추세 + 약간의 랜덤 노이즈
    const drift = (i - 2) * 0.12;               // 완만한 증가/감소
    const noise = (Math.random() - 0.5) * 0.1;  // ±0.05 정도
    const value = Number((base + drift + noise).toFixed(2));

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

/**
 * 총 4개 센서 × 각 5개 = 20개 레코드
 * species는 예시로 PFOS(SP-001)로 고정. 필요하면 센서마다 species_id를 바꿔도 OK.
 */
export const MOCK_MEASUREMENTS: Measurement[] = [
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-001", base: 3.2 }),
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-002", base: 1.1 }),
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-003", base: 0.5 }),
  ...makeSeries({ sensorId: "SN-001", speciesId: "SP-004", base: 0.3 }),

  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-001", base: 2.8 }),
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-002", base: 1.3 }),
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-003", base: 0.4 }),
  ...makeSeries({ sensorId: "SN-002", speciesId: "SP-004", base: 0.2 }),

  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-001", base: 4.1 }),
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-002", base: 1.5 }),
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-003", base: 0.6 }),
  ...makeSeries({ sensorId: "SN-003", speciesId: "SP-004", base: 0.4 }),

  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-001", base: 4.1 }),
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-002", base: 3.5 }),
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-003", base: 0.9 }),
  ...makeSeries({ sensorId: "SN-004", speciesId: "SP-004", base: 0.7 }),
];