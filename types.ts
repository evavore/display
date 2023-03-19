interface spaceXPayload {
    id: string
    type: string
}

interface spaceXFailures {
    reason: string
}

interface spaceXCore{
    id: string
    last_update: string
    serial: string
}

interface spaceXLaunch {
    name:string
    date_utc:string
    cores: {
        core: spaceXCore
    }[]
    payloads: spaceXPayload[]
    links: {
        patch:{
        small:string
        }
        webcast: string
    }
    success: boolean
    failures: spaceXFailures[]
    reason?: string
}
interface spaceXResponse {
    docs: spaceXLaunch[]
    totalPages: number
}

export type {
    spaceXResponse,
    spaceXLaunch,
    spaceXPayload,
    spaceXFailures
}
