import type { Sensor } from "../types/db";

export const MOCK_SENSORS: Sensor[] = [
    {
        // 부산
        id: "SN-001" as any,
        site_id: "S-001" as any,
        model: "team-aqua-field-3000",
        serial_no: "AQUA-2024001",
        params: {},
        install_at: "2024-01-20T10:00:00Z",
        latitude: 35.1796,
        longitude: 129.0756,
        status: "active",
        comms: "nbiot",
        created_at: "2024-01-20T10:00:00Z"
    },
    {
        // 대전
        id: "SN-002" as any,
        site_id: "S-002" as any,
        model: "team-aqua-field-3000",
        serial_no: "AQUA-2024002",
        params: {},
        install_at: "2024-02-05T09:15:00Z",
        latitude: 36.3504,
        longitude: 127.3845,
        status: "active",
        comms: "ltem",
        created_at: "2024-02-05T09:30:00Z",
    },
    {
        // 한강
        id: "SN-003" as any,
        site_id: "S-003" as any,
        model: "team-aqua-field-3000",
        serial_no: "AQUA-2024003",
        params: {},
        install_at: "2024-02-12T14:00:00Z",
        latitude: 37.5665,
        longitude: 127.05,
        status: "repair",
        comms: "wifi",
        created_at: "2024-02-12T14:15:00Z",
    },
    {
        // 광주
        id: "SN-004" as any,
        site_id: "S-004" as any,
        model: "team-aqua-field-3000",
        serial_no: "AQUA-2024004",
        params: {},
        install_at: "2024-03-10T11:00:00Z",
        latitude: 35.1595,
        longitude: 126.8526,
        status: "inactive",
        comms: "5g",
        created_at: "2024-03-10T11:20:00Z",
    }

]