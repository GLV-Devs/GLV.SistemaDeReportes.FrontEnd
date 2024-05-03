import { useContext } from "react";
import { AppContext } from "./context/AppContext";

export function convertToISO(originalDate){
    const dateParts = originalDate.split(' ');
    const date = dateParts[0];
    const time = dateParts[1];
    const dateTime = new Date(`${date} ${time}`);
    const isoDate = dateTime.toISOString();

    return isoDate
}

export function getRoleName(id){
    const {rolesList} = useContext(AppContext)
    rolesList.map((item) => {
        if(item.id == id){
            return item.name
        }
    })
}

export function getProductName(id){
    const {productList} = useContext(AppContext)
    productList.map((item) => {
        if(item.id == id){
            return item.name
        }
    })
}

export function getIdTypeName(id){
    const {idTypeList} = useContext(AppContext)
    idTypeList.map((item) => {
        console.log(item)
        if(item.id == id){
            return item.name
        }
    })
}