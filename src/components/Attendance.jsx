import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { apiAddress, accessToken } from '../globalResources'
import { CircularProgress, Button, TextField } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { getReportInfo } from '../functions'
import { message } from "antd";

export const Attendance = ({personKey, close, personName}) => {

    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    function getInfo(){
        setError(false)
        setLoading(true)
        axios.get(`${apiAddress}/api/person/attendance/${personKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setAttendanceList(response.data.data)
            console.log(response)
            setLoading(false)
        }).catch((err) => {
            setError(true)
            setLoading(false)
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {getInfo()}, [])

    const [attendanceList, setAttendanceList] = useState([])

    return(
        <div className="Modal ">
            {contextHolder}
            <h1>{personName}'s Attendance</h1>
            { loading ? (
                <CircularProgress/>
            ):(
                <>
                    { error ? (
                        <>
                            <h1>An error has ocurred</h1>
                            <Button variant='contained' onClick={() => getInfo}>Retry</Button>
                        </>
                    ):(
                        <table>
                            <tr>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Note</th>
                            </tr>
                            { attendanceList.map((item) => (
                                <tr>
                                    <td>{new Date(item.report.dateReported).toLocaleString()}</td>
                                    <td>{item.project.name}</td>
                                    <td>{item.notes}</td>
                                </tr>
                            )) }
                        </table>
                    ) }
                </>
            ) }
            <Button variant='contained' color='error' onClick={close}>close</Button>
        </div>
    )
}

export const EditAttendance = ({close, note, reportKey, personKey, reload}) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    function edit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            notes: e.target[0].value
        }
        axios.put(`${apiAddress}/api/reports/attendance/${reportKey}/${personKey}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setSuccess(true)
            setLoading(false)
            console.log(response)
        }).catch((err) => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }            
            console.log(err.response)
            setError(true)
            setLoading(false)
        })
    }

    return(
        <form className='Modal' onSubmit={edit}>
            {contextHolder}
            { success ? (
                <>
                    <h1>Attendance edited</h1>
                    <Button variant='contained' color='error' onClick={() => {close(); reload()}}>close</Button>
                </>
            ):(
                <>
                    <h1>Edit this attendance?</h1>
                    <TextField label='Note' multiline defaultValue={note} disabled={loading}/>
                    <div className='Buttons'>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>close</Button>
                        <Button variant='contained' type='submit' disabled={loading}>save</Button>
                    </div>         
                </>
            ) }
        </form>
    )
}