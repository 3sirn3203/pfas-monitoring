import type { LabConfirmation } from "../types/db";

export const MOCK_LAB_CONFIRMATIONS: LabConfirmation[] = [
  {
    id: "LC-0001" as any,
    alert_id: "AL-001" as any,           // SN-001 • PFOS
    site_id: "S-001" as any,             // 부산 정수장
    sample_ts: "2025-09-08T05:30:00Z",
    reported_ts: "2025-09-09T06:00:00Z",
    species_id: "SP-001" as any,         // PFOS
    value: 3.6,
    unit: "ng/L",
    method: "LC-MS/MS",
    conforms: false,                      // 기준 3.0 초과
  },
  {
    id: "LC-0002" as any,
    alert_id: "AL-003" as any,           // SN-002 • PFOS
    site_id: "S-002" as any,             // 대전 하천 측정소
    sample_ts: "2025-09-08T14:00:00Z",
    reported_ts: "2025-09-09T15:30:00Z",
    species_id: "SP-001" as any,
    value: 3.1,
    unit: "ng/L",
    method: "LC-MS/MS",
    conforms: true,                       // 기준 3.0 부근(보수적으로 통과 처리)
  },
  {
    id: "LC-0003" as any,
    alert_id: "AL-007" as any,           // SN-003 • PFHxS
    site_id: "S-003" as any,             // 한강 취수장
    sample_ts: "2025-09-09T12:00:00Z",
    reported_ts: "2025-09-10T12:30:00Z",
    species_id: "SP-003" as any,         // PFHxS
    value: 2.1,
    unit: "ng/L",
    method: "LC-MS/MS",
    conforms: true,                       // 예시 기준 300 → 통과
  },
  {
    id: "LC-0004" as any,
    alert_id: "AL-008" as any,           // SN-004 • PFOS
    site_id: "S-004" as any,             // 광주 지하수 모니터링 센터
    sample_ts: "2025-09-09T16:00:00Z",
    reported_ts: "2025-09-10T17:00:00Z",
    species_id: "SP-001" as any,
    value: 3.4,
    unit: "ng/L",
    method: "LC-MS/MS",
    conforms: true,
  },
  {
    id: "LC-0005" as any,
    alert_id: "AL-020" as any,           // SN-001 • PFOS
    site_id: "S-001" as any,
    sample_ts: "2025-09-11T16:00:00Z",
    reported_ts: "2025-09-12T10:00:00Z",
    species_id: "SP-001" as any,
    value: 5.1,
    unit: "ng/L",
    method: "LC-MS/MS",
    conforms: false,                      // 기준 3.5 초과
  },
];

