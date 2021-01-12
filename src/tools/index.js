export const markToDouble = (mark, precision) => {
    return ((mark * 100) / 100).toFixed(precision)
}

export const dateToString = (date, format = 'Y/m/d') => {
    switch (format) {
        case 'd/m/Y':
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        case 'Y/m/d':
        default:
            return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    }
}

