import { useState, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import { Button, TextField, Select, MenuItem, CircularProgress, Skeleton } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const ViewReport = ({reportKey, close}) => {

    console.log(reportKey)
    const navigate = useNavigate()

    useEffect(() => {
        async function getInfo(){
            try{
                const response = await axios.get(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
                console.log(response)
                const dateReported = new Date(response.data.data[0].dateReported)
                if(response.data.data[0].reporterUser.lastNames == null){lastNames = ''}else{lastNames = response.data.data[0].reporterUser.lastNames}
                setInfo({
                    dateReported: `${dateReported.getDate()}/${dateReported.getMonth() + 1}/${dateReported.getFullYear()}`,
                    reportedBy: `${response.data.data[0].reporterUser.names} ${lastNames}`
                })
                if(response.status == 200){
                    setLoading(false)
                }
            }catch(err){
                console.log(err)
                if(err.response.status == 401){
                    navigate('/Login')
                }
            }
        }
        getInfo()
    },[])

    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState()
    let lastNames

    return(
        <div className='Modal full'>
            <h1>Report info</h1>
            { loading ? (
                <>
                <Skeleton width={300} height={40} animation='wave'/>
                <Skeleton width={300} height={40} animation='wave'/>
                <Skeleton width={500} height={80} animation='wave' variant='rounded'/>
                </>
            ):(
                <>
                    <h3>Reported by: {info.reportedBy}</h3>
                    <h3>Date reported: {info.dateReported}</h3>
                </>
            ) }
            
            <Button onClick={close} color='error' variant='contained'>Close</Button>
        </div>
    )
}

export const AddAtachments = ({close, lineId}) => {

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    function upload(){
        setLoading(true)
        setSuccess(false)
        setError(false)
        axios.post(`${apiAddress}/data/images/report/${lineId}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setLoading(false)
            setSuccess(true)
        }).catch((err) => {
            console.log(err.response)
            setError(true)
        })
    }

    return(
        <div className="Modal">
            <h1>select the files you want to upload</h1>
            <input type='file' multiple disabled={loading}/>
            { success && <h3 style={{color: 'green'}}>The files have been uploaded, if you want to upload more you can do so</h3> }
            { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
            <Button>{loading ? (<CircularProgress/>):(<>upload</>)}</Button>
            <Button variant='contained' color='error' onClick={close}>close</Button>
        </div>
    )
}

export const EditReportLine = () => {
    return(
        <div className="Modal">

        </div>
    )
}

export const EditReportInfo = ({reportKey, close}) => {

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
            dateReported: e.target[3].value,
        }
        axios.put(`${apiAddress}/api/reports/${reportKey}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setSuccess(true)
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            <h1>Edit this report</h1>
            {success ? (
                <>
                    <h1>Changes saved</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </>
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
            <div className='Buttons'>
                <Button variant='contained' type='submit'>Save</Button>
                <Button variant='contained' color='error' onClick={close}>Cancel</Button>
            </div>
            </>)}
            
        </form>
    )
}