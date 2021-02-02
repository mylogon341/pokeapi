
import { NameURL } from "./common";

export class Encounter {
    min_level: number
    max_level: number
    chance: number
    method: NameURL
    condition_values: NameURL[]

    constructor(data: Record<string, any>) {
        this.min_level = Number(data.min_level)
        this.max_level = Number(data.max_level)
        this.chance = Number(data.chance)
        this.method = NameURL.fromObj(data.method)
        this.condition_values = data.condition_values.map(obj => NameURL.fromObj(obj))
    }
}

export class VersionEncounterDetail {
    version: NameURL
    max_chance: number
    encounter_details: Encounter[]

    constructor(data: Record<string, any>) {
        this.version = NameURL.fromObj(data.version)
        this.max_chance
        this.encounter_details = data.encounter_details.map(obj => new Encounter(obj))
    }
}

export class EncounterInfo {
    location_area: NameURL
    version_details: VersionEncounterDetail[]
    constructor(data: Record<string, any>) {
        this.location_area = NameURL.fromObj(data.location_area)
        this.version_details = data.version_details.map(vd => new VersionEncounterDetail(vd))
    }
}

class EncounterLocation {
    version_encounter_detail: Encounter[]
    location: string
    constructor(details: Encounter[], location: string) {
        this.version_encounter_detail = details
        this.location = location
    }
}

export class GameEncounters {
    id: number
    game: string
    encounters: EncounterLocation[]
    constructor(id: number, name: string, encounter: EncounterLocation) {
        this.id = id
        this.game = name
        this.encounters = [encounter]
    }
}

export function sortEncounterDetails(details: EncounterInfo[]): GameEncounters[] {

    const games: GameEncounters[] = []

    details.forEach(detail => {

        detail.version_details.forEach(vDeet => {
            const existing =
                games
                    .filter(item => item.game === vDeet.version.name)

            const name = vDeet.version.name
            const id = vDeet.version.url.versionNumberFromUrl()
            vDeet.version = undefined

            if (existing.length === 1) {
                existing[0].encounters.push(new EncounterLocation(vDeet.encounter_details, detail.location_area.name))
            } else {
                games.push(
                    new GameEncounters(
                        id,
                        name,
                        new EncounterLocation(vDeet.encounter_details, detail.location_area.name)
                    )
                )
            }

        })
    });

    return games
}