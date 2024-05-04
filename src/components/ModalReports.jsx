import { useState, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import { Button, TextField, Select, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'

export const ViewReport = async({reportKey, close}) => {

    const [info, setInfo] = useState()
    const dateReported = new Date(info.dateReported)

    useEffect(() => {getInfo()}, [])

    async function getInfo(){
        axios.get(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response.data.data[0])
            setInfo(response.data.data[0])
        })
    }

    return(
        <div className="Modal">
            {/* <h3>Date reported: {info ? (dateReported.toDateString()):(null)}</h3>
            <h3>Reported by: {info ? (info.reporterUser.names):(null)}</h3> */}
            <Button onClick={close} variant='contained' color='error'>close</Button>
        </div>
    )
}

export const AddAtachments = () => {
    return(
        <div className="Modal">

        </div>
    )
}

export const EditReportLine = () => {
    return(
        <div className="Modal">

        </div>
    )
}

export const EditReportInfo = ({projectKey, close}) => {

    const [staffList, setStaffList] = useState([])
    const [staffSelected, setStaffSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    function getStaffList(){
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setStaffList(response.data.data)
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        const data = {
            projectId: projectKey,
            dateReported: staffSelected,
        }
        axios.put(`${apiAddress}/api/reports`, data, {headers: {'Authorization': `Session ${accessToken}`}})
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            <h1>Edit this report</h1>
            {success ? (
                <h1>Changes saved</h1>
            ):(<>
                <Select
                    value={staffSelected}
                    onChange={(e)=>{setStaffSelected(e.target.value)}}
                >
                {staffList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label='Date reported'/>
            </LocalizationProvider>
            <div>
            <Button variant='contained' type='submit'>Save</Button>
            <Button variant='contained' color='error' onClick={close}>Cancel</Button>
            </div>
            </>)}
            
        </form>
    )
}