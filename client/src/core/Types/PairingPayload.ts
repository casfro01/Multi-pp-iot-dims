export type PairingPayload = {
    DeviceId: string
    Code: string
    DisplayName: string
}

export function mapToPairingPayload(raw: any): PairingPayload {
    return {
        DeviceId: raw.DeviceId,
        Code: raw.Code,
        DisplayName: raw.DisplayName,
    }
}