import {SetStateAction, Dispatch } from 'react';

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

interface LaunchTableRowProps {
    data: spaceXLaunch
}

interface PaginationProps {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    totalPages: number
  }

interface LaunchDataTableProps{
    launches: spaceXLaunch[]
}

export type {
    spaceXResponse,
    spaceXLaunch,
    spaceXPayload,
    spaceXFailures,
    LaunchTableRowProps,
    PaginationProps,
    LaunchDataTableProps
}
