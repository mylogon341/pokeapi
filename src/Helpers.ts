export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function versionNumberFromUrl(url: string): number {
    const splits = url.split("/")
    return Number(splits[splits.length - 2])
}

export function camelToPresentation(value: string): string {
    return capitalizeFirstLetter(value.replace(/_/g, " "))
}

export function dashStringToSentence(value: string): string {
    return capitalizeFirstLetter(value.replace(/-/g, " "))
}

export function lineBreaksToString(value: string): string {
    return value.replace(/\n/g, " ")
}
