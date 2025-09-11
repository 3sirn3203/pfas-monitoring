// --- ID 브랜딩(실수 방지용) ---
type Brand<K, T> = K & { __brand: T };

export type OrgId = Brand<string, "OrgId">;
export type SiteId = Brand<string, "SiteId">;
export type SensorId = Brand<string, "SensorId">;
export type SpeciesId = Brand<string, "SpeciesId">;
export type AlertId = Brand<string, "AlertId">;

// bigint/bigserial은 JS 안전 범위 이슈가 있어 프로토타입에선 string 권장
export type ISODateTime = string;

// enums (DB는 text지만, 프론트는 유니온으로 제한)
export type SensorStatus = "active" | "inactive" | "repair";
export type CommsType = "lora" | "nbiot" | "ltem" | "5g" | "wifi";
export type StandardBasis = "drinking_water" | "effluent" | "raw_water";
export type AlertLevel = "INFO" | "WARN" | "ALERT";
export type AlertRule = "threshold" | "anomaly_ml" | "jump";
export type AlertState = "open" | "ack" | "closed";

// ---------- Tables ----------
export type Organization = {
    id: OrgId;
    name: string;
    type: string;
    created_at: ISODateTime;
};

export type Site = {
    id: SiteId;
    org_id: OrgId;                // FK
    name: string;
    water_body_type: string;
    created_at: ISODateTime;
};

export type Sensor = {
    id: SensorId;
    site_id: SiteId;              // FK
    model: string;
    serial_no: string;            // unique
    params: Record<string, unknown>; // jsonb
    install_at: ISODateTime;
    latitude: number;
    longitude: number;
    status: SensorStatus;
    comms: CommsType;
    created_at: ISODateTime;
};

export type PFASSpecies = {
    id: SpeciesId;
    code: string;                 // PFOS, PFOA, PFHxS...
    name: string;
    cas_no: string;
};

export type SensorSpecies = {
    sensor_id: SensorId;
    species_id: SpeciesId;
    created_at: ISODateTime;
};

export type Standard = {
    id: Brand<string, "StandardId">;
    org_id?: OrgId | null;        // nullable
    species_id: SpeciesId;        // FK
    basis: StandardBasis;
    unit: string;
    mcl: number;                  // numeric → number (proto)
    note?: string | null;
    effective_from: string;       // date
    effective_to?: string | null; // date
};

export type Measurement = {
    ts: ISODateTime;              // PK part
    sensor_id: SensorId;          // PK part / FK
    species_id: SpeciesId;        // PK part / FK
    value: number;
    unit: string;
    temp_c?: number | null;
    flow_cms?: number | null;
    quality?: Record<string, unknown>;
};

export type Alert = {
    id: AlertId;
    ts: ISODateTime;
    sensor_id: SensorId;          // FK
    species_id: SpeciesId;        // FK
    rule: AlertRule;
    measured: number;
    threshold: number;
    status: AlertState;
    meta?: Record<string, unknown>;
};

export type LabConfirmation = {
    id: Brand<string, "LabConfId">;
    alert_id: AlertId;            // FK
    site_id: SiteId;              // FK
    sample_ts: ISODateTime;
    reported_ts: ISODateTime;
    species_id: SpeciesId;        // FK
    value: number;
    unit: string;
    method: string;               // e.g., 'LC-MS/MS'
    conforms: boolean;
};

export type Calibration = {
    id: Brand<string, "CalibrationId">;
    sensor_id: SensorId;          // FK
    started_at: ISODateTime;
    ended_at?: ISODateTime | null;
    method: string;
    result?: Record<string, unknown>; // slope, intercept, rmse...
    technician?: string | null;
};

export type MaintenanceLog = {
    id: Brand<string, "MaintLogId">;
    sensor_id: SensorId;          // FK
    ts: ISODateTime;
    action: string;
    note?: string | null;
};

export type NetworkStatus = {
    ts: ISODateTime;              // PK part
    sensor_id: SensorId;          // PK part / FK
    rssi: number;
    snr: number;
    battery_v: number;
    tx_ok: boolean;
};