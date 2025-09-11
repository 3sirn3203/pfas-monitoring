import type { Site } from "../types/db";

export const MOCK_SITES: Site[] = [
    {
        id: "S-001" as any,
        org_id: "O-1001" as any,
        name: "부산 정수장",
        water_body_type: "reservoir",
        created_at: "2024-01-15T09:00:00Z"
    },
    {
        id: "S-002" as any,
        org_id: "O-1002" as any,
        name: "대전 하천 측정소",
        water_body_type: "river",
        created_at: "2024-02-01T08:30:00Z"
    },
    {
        id: "S-003" as any,
        org_id: "O-1003" as any,
        name: "한강 취수장",
        water_body_type: "river",
        created_at: "2024-02-10T14:20:00Z"
    },
    {
        id: "S-004" as any,
        org_id: "O-1001" as any,
        name: "광주 지하수 모니터링 센터",
        water_body_type: "groundwater",
        created_at: "2024-03-05T11:15:00Z"
    }

]
