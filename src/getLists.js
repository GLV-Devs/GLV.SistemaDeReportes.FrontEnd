import { apiAddress, accessToken } from "./globalResources";
import axios from "axios";

export async function getReportLineCategoryList(){
    try{
        const response = await axios.get(`${apiAddress}/api/reports/lines/categories`, {headers: {'Authorization': `Session ${accessToken}`}})
        if(response.data.data == null){
            return [{name: ''}]
        }else{ return response.data.data }
    }catch(err){
        console.log(err.response)
        return [{name: 'error'}]
    }
}

export async function getRolesList(){
    try{
        const response = await axios.get(`${apiAddress}/api/project/roles`, {headers: {'Authorization': `Session ${accessToken}`}})
        if(response.data.data == null){
            return [{name: ''}]
        }else{return response.data.data}
    }catch(err){
        return([{name: 'Error'}])
    }
}

export async function getProductList(){
    try{
        const response = await axios.get(`${apiAddress}/api/product`, {headers: {'Authorization': `Session ${accessToken}`}})
        if(response.data.data == null){
            return [{name: ''}]
        }else{return response.data.data}
    }catch(err){
        return([{name: 'Error'}])
    }
}

export async function getIdTypeList(){
    try{
        const response = await axios.get(`${apiAddress}/api/identificationtype`, {headers: {'Authorization': `Session ${accessToken}`}})
        if(response.data.data == null){
            return [{name: ''}]
        }else{return response.data.data}
    }catch(err){
        return([{name: 'Error'}])
    }
}

export async function getProjectStateList(){
    try{
        const response = await axios.get(`${apiAddress}/api/project/states`, {headers: {'Authorization': `Session ${accessToken}`}})
        if(response.data.data == null){
            return [{name: ''}]
        }else{return response.data.data}
    }catch(err){
        return([{name: 'Error'}])
    }
}