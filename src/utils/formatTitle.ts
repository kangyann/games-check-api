/**
 * @function formatTitle
 * @param {text: string}
 * @returns {string}
 */
export function formatTitle({ text }: { text: string }): string {
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}