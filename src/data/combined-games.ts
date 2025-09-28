import mlbbjson from "@/data/games/mobile-legends.json"
import ffjson from "@/data/games/free-fire.json"
import pbjson from "@/data/games/pointblank.json"
export const CombinedGames: any = {
    "mobile-legends": mlbbjson.data,
    "free-fire": ffjson.data,
    "point-blank" : pbjson.data
}