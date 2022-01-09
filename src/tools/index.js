export const markToDouble = (mark, precision) => {
    return ((mark * 100) / 100).toFixed(precision)
}

const zeroPad = (number) => {
    if (number > 9) return `${number}`;
    return `0${number}`;
}

export const dateToString = (date, format) => {
    switch (format) {
        case 'd/m/Y':
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        case 'Y/m/d':
            return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        case 'Y-M-d':
            return `${date.getFullYear()}-${zeroPad(date.getMonth()+1)}-${zeroPad(date.getDate())}`;
        default:
        case 'Y-m-d':
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
}

