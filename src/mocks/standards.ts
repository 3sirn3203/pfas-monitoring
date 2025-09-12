import type { Standard } from "../types/db";

export const MOCK_STANDARDS: Standard[] = [
    {
        id: "ST-001" as any,
        org_id: "O-1001" as any,            // 환경부
        species_id: "SP-001" as any,        // PFOS
        basis: "drinking_water",
        unit: "ng/L",
        mcl: 70,                            // 예시값
        note: "국내 가이드라인 기반",
        effective_from: "2024-01-01",
        effective_to: "2026-12-31",
    },
    {
        id: "ST-002" as any,
        org_id: "O-1001" as any,            // 환경부
        species_id: "SP-002" as any,        // PFOA
        basis: "drinking_water",
        unit: "ng/L",
        mcl: 80,                            // 예시값
        note: "국내 가이드라인 기반",
        effective_from: "2024-01-01",
        effective_to: "2026-12-31",
    },
    {
        id: "ST-003" as any,
        org_id: "O-1002" as any,
        species_id: "SP-001" as any,        // PFOS
        basis: "raw_water",
        unit: "ng/L",
        mcl: 200,                           // 예시값
        note: "수처리 시설용",
        effective_from: "2024-03-01",
    },
    {
        id: "ST-004" as any,
        org_id: null,
        species_id: "SP-003" as any,        // PFHxS
        basis: "effluent",
        unit: "ng/L",
        mcl: 300,                           // 예시값
        note: "국제 기준 참조",
        effective_from: "2024-05-15",
    }
]