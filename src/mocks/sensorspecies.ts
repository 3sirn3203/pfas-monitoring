import type { SensorSpecies } from "../types/db";

function makeSeries(sensorId: string, createdAt: string): SensorSpecies[] {
  const species = ["SP-001", "SP-002", "SP-003"];
  return species.map(sp => ({
    sensor_id: sensorId as any,
    species_id: sp as any,
    created_at: createdAt,
  }));
}

export const MOCK_SENSOR_SPECIES: SensorSpecies[] = [
  ...makeSeries("SN-001", "2024-01-20T10:00:00Z"),
  ...makeSeries("SN-002", "2024-02-05T09:15:00Z"),
  ...makeSeries("SN-003", "2024-02-12T14:00:00Z"),
  ...makeSeries("SN-004", "2024-03-10T11:00:00Z"),
];