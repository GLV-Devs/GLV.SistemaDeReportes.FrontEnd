import { useState, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import { Button, TextField, Select, MenuItem, CircularProgress } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const ViewReport = ({reportKey, close}) => {

    // declaraciones:
    const navigate = useNavigate()
    let dateReported
    // control de estados:
    const [loading, setLoading] = useState(true)
    const [loadingAddLine, setLoadingAddLine] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(0)
    // informacion para mostrar:
    const [info, setInfo] = useState(null)
    const [linesList, setLinesList] = useState([])

    useEffect(() => {getInfo(); getLinesList()}, [])

    async function getInfo(){
        axios.get(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response.data.data[0])
            setInfo(response.data.data[0])
            dateReported = new Date(info.dateReported)
        })
    }
    async function getLinesList(){
        axios.get(`${apiAddress}/api/reports/lines/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // setLinesList(response.data.data)
            console.log(response.data.data)
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function addReportLine(){
        setLoadingAddLine(true)
        const inputLine = document.getElementById('line')
        const data = {
            reportId: reportKey,
            description: inputLine.value,
            category: selectedCategory,
        }
        axios.post(`${apiAddress}/api/reports/lines`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setLoadingAddLine(false)
        })
    }

    return(
        <div className='Modal'>
            { loading ? (<CircularProgress/>):(
                <>
                    <h3>{dateReported}</h3>
                    <h3>Reported by: {info.reporterUser.names}</h3>
                    <table>
                        <th>Description</th>
                        <th>Category</th>
                        {linesList.map((item) => (
                            <tr>
                                <td>{item.description}</td>
                                <td className='cat'>{item.category}</td>
                            </tr>
                        ))}
                    </table>
                    <div className="NewLine">
                        <TextField multiline label='Description' id='line' disabled={loadingAddLine}/>
                        <InputLabel id="Category" sx={{position: "relative", bottom: '40px', left: '40px'}}>Category</InputLabel>
                        <Select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            id="Category"
                            labelId="Category"
                            label="Category"
                            disabled={loadingAddLine}
                            sx={{width: '150px', position: 'relative', right: '30px'}}
                        >
                            {reportLineCategoryList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        <Tooltip title='Add report line'>
                            <Fab disabled={loadingAddLine} onClick={() => saveLine()} color='info' sx={{position: 'relative', left: '20px'}}> <AddIcon/> </Fab>
                        </Tooltip>
                    </div>
                </>
            ) }
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