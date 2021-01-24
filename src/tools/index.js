export const markToDouble = (mark, precision) => {
    return ((mark * 100) / 100).toFixed(precision)
}

export const dateToString = (date, format) => {
    switch (format) {
        case 'd/m/Y':
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        case 'Y/m/d':
            return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        default:
        case 'Y-m-d':
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
}

