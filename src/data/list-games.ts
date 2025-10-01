/**
 * @constant
 * @exports ListGamesType
 * @type {string[]}
 */

export type ListGamesTypes = Record<"name" | "prefix", string>;

export const ListGames: ListGamesTypes[] = [
   {
      name: "Mobile Legends",
      prefix: "mobile-legends",
   },
   {
      name: "Free Fire",
      prefix: "free-fire",
   },
   {
      name: "Point Blank",
      prefix: "point-blank",
   },
];
