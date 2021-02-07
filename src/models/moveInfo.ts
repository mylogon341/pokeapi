export class MoveInfo {
    name: string
    type: string
    constructor(data: any) {
        this.name = data.name.removeDashes().capitaliseEachWord()
        this.type = data.type.name.removeDashes().capitaliseEachWord()
    }
}