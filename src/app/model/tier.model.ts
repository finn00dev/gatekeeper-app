export interface Tier {
    title: string,
    emoji: string,
    value: number,
    color?: string
}

export var GAME_TIERS: Tier[] = [
    {
        title: "Fake Fan",
        emoji: "❌",
        value: 0,
        color: "#C40000bc"
    },
    {
        title: "Band Tee",
        emoji: "⚡️",
        value: 3,
        color: "#820263"
    },
    {
        title: "Deep Cut Listener",
        emoji: "💿",
        value: 7,
        color: "#688E26"
    },
    {
        title: "Set List Psychic",
        emoji: "🎙️",
        value: 11,
        color: "#FB8B24"
    },
    {
        title: "MEGAFAN",
        emoji: "🌟",
        value: 16,
        color: "#85BDBF"
    }
]