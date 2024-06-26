export const markToDouble = (mark: number, precision: number) => {
    return ((mark * 100) / 100).toFixed(precision)
}

export const zeroPad = (number: number) => {
    if (number > 9) return `${number}`;
    return `0${number}`;
}

export const dateToString = (date?: Date, format?: string) => {
    if (!date) return '';
    
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

export const markWithUnit = (mark: number, precision: number, markType: "mark" | "time") => {
    const roundedMark = markToDouble(mark, precision);
    const unit = markType === 'time' ? '"' : '';

    return `${roundedMark}${unit}`;
}