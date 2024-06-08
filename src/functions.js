import axios from 'axios'
import { apiAddress, accessToken } from './globalResources'

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

export function getFullPersonName(id, list){
    let response = list.find((item) =>  item.id == id)
    console.log(response)
    return response
}

export function capitalize(raw){
    let firstLetter = raw.charAt(0)
    let capitalLetter = firstLetter.toUpperCase()
    let capitalizedWord = `${capitalLetter}${raw.slice(1)}`
    return capitalizedWord
}

export function getReportInfo(reportId){
    axios.get(`${apiAddress}/api/reports/${reportId}`, {headers: {'Authorization': `Session ${accessToken}`}})
    .then((response) => {
        return response.data.data
        console.log(response)
    }).catch((err) => {
        console.log(err.response)
    })
}