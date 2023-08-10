export const supportType: { name: string, value: string; }[] = [
    {name: "aide", value: "help"},
    {name: "suggestion", value: "suggestion"}
]

export const timeOptions: { [key: string]: { seconds: number, name: string } } = {
    s: {seconds: 1, name: "secondes"},
    m: {seconds: 60, name: "minutes"},
    h: {seconds: 60 * 60, name: "heures"},
    d: {seconds: 60 * 60 * 24, name: "jours"},
}