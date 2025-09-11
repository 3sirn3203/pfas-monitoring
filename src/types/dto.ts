import type { Sensor, Site, PFASSpecies, ISODateTime } from "./db";

export type SensorWithSiteDTO = Sensor & {
    site?: Pick<Site, "id" | "name" | "water_body_type">;
};

export type MeasurementRowDTO = {
    ts: ISODateTime;
    sensor_serial: string;
    site_name: string;
    species_code: string; // 'PFOS'
    value: number;
    unit: string;
};

export type DashboardCardDTO = {
    sensor_id: Sensor["id"];
    sensor_name: string;
    site_name: string;
    pfos: number;
    pfoa: number;
    pfhxs: number;
    ts: ISODateTime;
};

export type SpeciesMap = Record<PFASSpecies["id"], PFASSpecies>;