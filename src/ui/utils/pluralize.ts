export function pluralize(num: number, single: string, plural: string) {
    return num === 1 ? single : plural;
}