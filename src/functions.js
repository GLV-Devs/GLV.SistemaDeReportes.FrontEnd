export function convertToISO(originalDate){
    const dateParts = originalDate.split(' ');
    const date = dateParts[0];
    const time = dateParts[1];
    const dateTime = new Date(`${date} ${time}`);
    const isoDate = dateTime.toISOString();

    return isoDate
}