import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { apiAddress, accessToken } from '../globalResources'
import { CircularProgress, Button } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { getReportInfo } from '../functions'

export const Attendance = ({personKey, close, personName}) => {

    const navigate = useNavigate()

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

export const EditAttendance = ({close, note, reportKey, personKey}) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    function edit(){
        setError(false)
        setLoading(true)
        axios.put(`${apiAddress}/api/reports/attendance/${reportKey}/${personKey}`, data, {headers: {'Authorization': `Session ${apiAddress}`}})
        .then((response) => {
            setSuccess(true)
            console.log(response)
        }).catch((err) => {
            console.log(err.response)
            setError(true)
            setLoading(false)
        })
    }

    return(
        <div className='Modal'>
            { success ? (
                <>
                    <h1>Attendance edited</h1>
                    <Button variant='contained' color='error'>close</Button>
                </>
            ):(
                <>
                    <h1>Edit this attendance?</h1>
                    <TextField label='Note' multiline disabled={loading} />
                    <div className='Buttons'>
                        <Button variant='contained' color='error'>close</Button>
                        <Button variant='contained'>save</Button>
                    </div>         
                </>
            ) }
        }
        </div>
    )
}