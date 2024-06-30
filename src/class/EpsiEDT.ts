/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const epsi_edt = require('@luzilab.epsinyx/epsi-edt')

export interface EdtElement {
    name: string
    room: string
    teacher: string
    date: string
    start_time: boolean
    end_time: boolean
}
/**
 * Représentation du module de scraping de l'EDT Reseau CD (écrit en Rust)
 */
export class EpsiEDT {
    constructor() {}

    getDay(username: string, date: string): EdtElement[] {
        return epsi_edt.getDay(username, date)
    }

    getDays(
        username: string,
        start_date: string,
        end_date: string
    ): EdtElement[][] {
        return epsi_edt.getDays(username, start_date, end_date)
    }
}
