export const markToDouble = (mark, precision) => {
    return ((mark * 100) / 100).toFixed(precision)
}