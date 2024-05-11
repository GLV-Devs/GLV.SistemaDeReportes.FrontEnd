export function convertToISO(originalDate){
    const dateParts = originalDate.split(' ');
    const date = dateParts[0];
    const time = dateParts[1];
    const dateTime = new Date(`${date} ${time}`);
    const isoDate = dateTime.toISOString();

    return isoDate
}

export function getRoleName(id, list){
    list.map((item) => {
        if(item.id == id){
            return item.name
        }
    })
}

export function getItem(id, list){
    let response = list.find((item) => item.id == id)
    return response
}

export function getIdTypeName(id, list){
    list.map((item) => {
        console.log(item)
        if(item.id == id){
            return item.name
        }
    })
}