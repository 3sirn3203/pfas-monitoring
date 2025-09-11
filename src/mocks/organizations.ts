import type { Organization } from "../types/db";

export const MOCK_ORGANIZATIONS: Organization[] = [
    {
        id: "O-1001" as any,
        name: "환경부",
        type: "central_gov",
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "O-1002" as any,
        name: "K-water (한국수자원공사)",
        type: "public_corp",
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "O-1003" as any,
        name: "서울시 상수도사업본부",
        type: "local_gov",
        created_at: "2024-01-01T00:00:00Z",
    },
];