import type { PFASSpecies } from "../types/db";

export const MOCK_PFAS_SPECIES: PFASSpecies[] = [
    {
        id: "SP-001" as any,
        code: "PFOS",
        name: "Perfluorooctanesulfonic acid",
        cas_no: "1763-23-1",
    },
    {
        id: "SP-002" as any,
        code: "PFOA",
        name: "Perfluorooctanoic acid",
        cas_no: "335-67-1",
    },
    {
        id: "SP-003" as any,
        code: "PFHxS",
        name: "Perfluorohexanesulfonic acid",
        cas_no: "355-46-4",
    }
]
