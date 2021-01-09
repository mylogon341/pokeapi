import "../Helpers"

interface APIResource {
    name: string
    description: string
}

interface NamedAPIResource extends APIResource {
    id: number
    value: string
}

interface IntegerAPIResource extends APIResource {
    value: number
}

interface BooleanAPIResource extends APIResource {
    value: boolean
}

interface StringAPIResource extends APIResource {
    value: string
}


function genNamedAPIResource(name: string, description: string, data: any): NamedAPIResource | undefined {
    return data ? {
        name: name.removeDashes().capitaliseEachWord(),
        description: description,
        id: data.url.versionNumberFromUrl(),
        value: data.name.camelToPresentation()
    } : undefined
}

function genStringAPIResource(name: string, description: string, value: string): StringAPIResource | undefined {
    return value ?
        {
            name: name,
            description: description,
            value: value
        } : undefined
}

function genIntegerAPIType(name: string, description: string, value: number): IntegerAPIResource | undefined {
    return value ?
        {
            name: name,
            description: description,
            value: value
        } : undefined
}

function genBooleanAPIType(name: string, description: string, value: boolean): BooleanAPIResource | undefined {
    return value ?
        {
            name: name,
            description: description,
            value: value
        } : undefined
}

export class EvolutionDetails {

    item: NamedAPIResource
    trigger: NamedAPIResource
    gender: IntegerAPIResource
    held_item: NamedAPIResource
    known_move: NamedAPIResource
    known_move_type: NamedAPIResource
    location: NamedAPIResource
    min_level: IntegerAPIResource
    min_happiness: IntegerAPIResource
    min_beauty: IntegerAPIResource
    min_affection: IntegerAPIResource
    needs_overworld_rain: BooleanAPIResource
    party_species: NamedAPIResource
    party_type: NamedAPIResource
    relative_physical_stats: IntegerAPIResource
    time_of_day: StringAPIResource
    trade_species: NamedAPIResource
    turn_upside_down: BooleanAPIResource

    constructor(body) {
        this.item = genNamedAPIResource("Item", "The item required to cause evolution this into Pokémon species.", body.item)
        this.trigger = genNamedAPIResource("Trigger", "The type of event that triggers evolution into this Pokémon species.", body.trigger)
        this.gender = genIntegerAPIType("Gender", "The id of the gender of the evolving Pokémon species must be in order to evolve into this Pokémon species.", body.gender)
        this.held_item = genNamedAPIResource("Held item", "The item the evolving Pokémon species must be holding during the evolution trigger event to evolve into this Pokémon species.", body.held_item)
        this.known_move = genNamedAPIResource("Known move", "The move that must be known by the evolving Pokémon species during the evolution trigger event in order to evolve into this Pokémon species.", body.known_move)
        this.known_move_type = genNamedAPIResource("Known move type", "The evolving Pokémon species must know a move with this type during the evolution trigger event in order to evolve into this Pokémon species.", body.known_move_type)
        this.location = genNamedAPIResource("Location", "The location the evolution must be triggered at.", body.location)
        this.min_level = genIntegerAPIType("Minimum level", "The minimum required level of the evolving Pokémon species to evolve into this Pokémon species.", body.min_level)
        this.min_happiness = genIntegerAPIType("Minimum happiness", "The minimum required level of happiness the evolving Pokémon species to evolve into this Pokémon species.", body.min_happiness)
        this.min_beauty = genIntegerAPIType("Minimum beauty", "The minimum required level of beauty the evolving Pokémon species to evolve into this Pokémon species.", body.min_beauty)
        this.min_affection = genIntegerAPIType("Minimum affection", "The minimum required level of affection the evolving Pokémon species to evolve into this Pokémon species.", body.min_affection)
        this.needs_overworld_rain = genBooleanAPIType("Needs overworld rain", "Whether or not it must be raining in the overworld to cause evolution this Pokémon species.", body.needs_overworld_rain)
        this.party_species = genNamedAPIResource("Party species", "The Pokémon species that must be in the players party in order for the evolving Pokémon species to evolve into this Pokémon species.", body.party_species)
        this.party_type = genNamedAPIResource("Party type", "The player must have a Pokémon of this type in their party during the evolution trigger event in order for the evolving Pokémon species to evolve into this Pokémon species.", body.party_type)
        this.relative_physical_stats = genIntegerAPIType("Relative physical stats", "The required relation between the Pokémon's Attack and Defense stats. 1 means Attack > Defense. 0 means Attack = Defense. -1 means Attack < Defense.", body.relative_physical_stats)
        this.time_of_day = genStringAPIResource("Time of day", "The required time of day. Day or night.", body.time_of_day)
        this.trade_species = genNamedAPIResource("Trade species", "Pokémon species for which this one must be traded.", body.trade_species)
        this.turn_upside_down = genBooleanAPIType("Hold 3DS upside down", "Whether or not the 3DS needs to be turned upside-down as this Pokémon levels up.", body.turn_upside_down)
    }
}
