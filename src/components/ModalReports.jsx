import { useState, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import { Button, TextField } from '@mui/material'
import axios from 'axios'

export const ViewReport = async({reportKey, close}) => {

    const [info, setInfo] = useState()
    const dateReported = new Date(info.dateReported)

    useEffect(() => {getInfo()}, [])

    async function getInfo(){
        axios.get(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response.data.data[0].reporterUser.names)
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

export const EditReportInfo = () => {
    return(
        <div className="Modal">

        </div>
    )
}