import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { apiAddress, accessToken } from '../globalResources'
import { CircularProgress, Button } from "@mui/material"

export const Assistance = ({personKey}) => {

    function getInfo(){
        setError(false)
        setLoading(true)
        axios.get(`${apiAddress}/api/person/attendance/${personKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setLoading(false)
        }).catch((err) => {
            setError(true)
            setLoading(false)
            console.log(err.response)
        })
    }

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {getInfo()}, [])

    const [attendanceList, setAttendanceList] = useState([])

    return(
        <div className="Modal ">
            <h1>user assists</h1>
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
                            <th>
                                <td>Date</td>
                                <td>Project</td>
                            </th>
                            { attendanceList.map((item) => (
                                <tr>
                                    <td>{item.date}</td>
                                    <td>{item.project}</td>
                                </tr>
                            )) }
                        </table>
                    ) }
                </>
            ) }
            <Button variant='contained' color='error'>close</Button>
        </div>
    )
}