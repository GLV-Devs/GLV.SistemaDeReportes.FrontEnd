import { useState, useEffect, useContext } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import { Button, TextField, Select, MenuItem, CircularProgress, Skeleton, InputLabel, Tooltip, Fab, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AttachmentIcon from '@mui/icons-material/Attachment';
import {getFullPersonName} from '../functions'
import {EditAttendance} from './Attendance'
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ImagesModal, FilesModal } from './AtachmentsModal'
import { message } from "antd";
import dayjs from 'dayjs';

export const ViewReport = ({reportKey, close}) => {

    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getInfo()
    }, [])

    async function getInfo(){
        try{
            //aqui pedimos nombre de quien reporta y la fecha
            let lastNames
            const response1 = await axios.get(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
            const dateReported = new Date(response1.data.data[0].dateReported)
            if(response1.data.data[0].reporterUser.lastNames == null){lastNames = ''}else{lastNames = response1.data.data[0].reporterUser.lastNames}
            setInfo({
                dateReported: `${dateReported.getMonth() + 1}/${dateReported.getDate()}/${dateReported.getFullYear()}`,
                reportedBy: `${response1.data.data[0].reporterUser.names} ${lastNames}`
            })

            //aqui pedimos la lista del staff para mostrar en el select de agregar asistencias
            const response2 = await axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
            setStaffList(response2.data.data)

            //Aqui pedimos las asistencias, la funcion esta afuera porque debe renovarse
            getAttendance()
            //Aqui pedimos las lineas de reporte, la funcion esta afuera porque debe renovarse
            getLines()
        }catch(err){
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        }finally{
            setLoading(false)
        }
    }

    async function getAttendance(){
        try{
            const response = await axios.get(`${apiAddress}/api/reports/attendance/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
            setAttendanceList(response.data.data)
        }catch(err){
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('Login')
            }
        }
    }

    async function getLines(){
        try{
            let temp = []
            const response = await axios.get(`${apiAddress}/api/reports/lines/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
            response.data.data.map(async(item) => {
            axios.get(`${apiAddress}/api/reports/lines/categories/${item.categoryId}`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((res2) => {
                temp = [...temp, {
                    description: item.description,
                    category: res2.data.data[0].name,
                    // categoryId: res2.data.data[0].id,
                    id: item.id,
                    files: item.files,
                }]
                setLinesList(temp)
            })
            })
        }catch(err){
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        }
    }

    function saveLine(){
        setLoading(true)
        const inputLine = document.getElementById('line')
        const data = {
            "reportId": reportKey,
            "description": inputLine.value,
            "categoryId": selectedCategory
        }
        axios.post(`${apiAddress}/api/reports/lines`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            getLines()
            setLoading(false)
            inputLine.value = ''
        }).catch((err) => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            console.log(err.response)
            setLoading(false)
        })
    }

    function saveAttendance(){
        setLoading(true)
        const inputNote = document.getElementById('note')
        const data = {
            reportId: reportKey,
            notes: note.value,
            personId: selectedAssistance,
        }
        console.log(data)
        axios.post(`${apiAddress}/api/reports/attendance`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setLoading(false)
            getAttendance()
        }).catch((err) => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            console.log(err.response)
        })
    }

    const deleteLine = () => {
        setDeleting(true)
        console.log(selected)
        axios.delete(`${apiAddress}/api/reports/lines/${selected}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setDeleting(false)
            setModalDelete(false)
            getLines()
        }).catch((err) => {
            setDeleting(false)
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    function deleteReport(){
        console.log('ejecutanding')
        setDeleting(true)
        axios.delete(`${apiAddress}/api/reports/${reportKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setDeleting(false)
            setModalDeleteReport(false);
            ()=>{close}
        }).catch((err) => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            console.log(err.response)
        })
    }

    //controlled form
    const [selectedCategory, setSelectedCategory] = useState(0)
    const [selectedAssistance, setSelectedAssistance] = useState (0)
    //controlled form

    const [selected, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalDeleteReport, setModalDeleteReport] = useState(false)
    const [info, setInfo] = useState()
    const [linesList, setLinesList] = useState([])
    const {reportLineCategoryList} = useContext(AppContext)
    const [deleting, setDeleting] = useState(false)
    const [adding, setAdding] = useState(false)
    const [modalEditLine, setModalEditLine] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [attendanceList, setAttendanceList] = useState([])
    const [editAttendanceModal, setEditAttendanceModal] = useState(false)
    const [imagesModal, setImagesModal] = useState(false)
    const [filesModal, setFilesModal] = useState(false)
    let lastNames

    function deleteAttendance(personId){
        axios.delete(`${apiAddress}/api/reports/attendance/${reportKey}/${personId}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            getAttendance()
        }).catch((err) => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            console.log(err.response)
        })
    }

    return(
        <div className='Modal full'>
            {contextHolder}
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

                    <h2>Report lines</h2>
                    <table>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Atachments</th>
                        <th>options</th>
                        {linesList.map((item) => (
                            <tr>
                                <td className='desc' disabled><p>{item.description}</p></td>
                                <td className='cat'>{item.category}</td>
                                <td className='options'>
                                    <Tooltip title='Files'>
                                        <IconButton onClick={() => {setSelected(item);setFilesModal(true)}}> <InsertDriveFileIcon/> </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Images'>
                                        <IconButton onClick={() => {setSelected(item);setImagesModal(true)}}> <ImageIcon/> </IconButton>
                                    </Tooltip>
                                </td>
                                <td className='options'>
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={()=>{setSelected(item.id); setModalDelete(true)}}> <DeleteIcon/> </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Edit'>    
                                        <IconButton onClick={()=>{setModalEditLine(true); setSelected(item)}}> <ModeEditIcon/> </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </table>
                    <div className="NewLine">
                        <TextField multiline label='Description' id='line' sx={{width: '56%'}} disabled={adding}/>
                        <InputLabel id="Category" sx={{position: "relative", bottom: '40px', left: '40px'}}>Category</InputLabel>
                        <Select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            id="Category"
                            labelId="Category"
                            label="Category"
                            sx={{width: '150px', position: 'relative', right: '30px'}}
                            disabled={adding}
                        >
                            {reportLineCategoryList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        <Tooltip title='Add report line'>
                            <IconButton size='large' onClick={() => saveLine()} sx={{position: 'relative', left: '5px', backgroundColor: 'rgb(2, 136, 209)'}} disabled={loading}> {loading ? (<CircularProgress/>):(<AddIcon sx={{color: 'white'}}/>)} </IconButton>
                        </Tooltip>
                    </div>

                    <h2>Attendance</h2>
                    <table>
                        <th>Person</th>
                        <th>notes</th>
                        <th>options</th>
                        {attendanceList.map((item) => (
                            <tr>
                                <td className='desc' disabled><p>{getFullPersonName(item.personId, staffList).names} {getFullPersonName(item.personId, staffList).lastNames }</p></td>
                                <td className='cat'>{item.notes}</td>
                                <td className='options'>
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={() => deleteAttendance(item.personId)}> <DeleteIcon/> </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Edit'>    
                                        <IconButton onClick={() => {setSelected(item); setEditAttendanceModal(true)}}> <ModeEditIcon/> </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </table>

                    <div className='NewLine'>
                        <Select
                            onChange={(e) => {setSelectedAssistance(e.target.value)}}
                            value={selectedAssistance}
                            sx={{width: '150px', position: 'relative', right: '30px'}}
                            disabled={adding}
                        >
                            {staffList.map((item) => (
                                <MenuItem value={item.id} key={item.id}>{item.names} {item.lastNames}</MenuItem>
                            ))}
                        </Select>
                        <TextField label='Notes' multiline id='note' sx={{width: '56%'}} disabled={adding}/>
                        <Tooltip title='Add Attendance'>
                            <IconButton size='large' onClick={() => saveAttendance()} sx={{position: 'relative', left: '5px', backgroundColor: 'rgb(2, 136, 209)'}} disabled={loading}> {loading ? (<CircularProgress/>):(<AddIcon sx={{color: 'white'}}/>)} </IconButton>
                        </Tooltip>
                    </div>
                    <Button variant='contained' color='warning' onClick={() => {setModalDeleteReport(true)}}>Delete Report</Button>
                </>
            ) }
            
            <Button onClick={close} color='error' variant='contained'>Close</Button>

            { modalDelete && 
            <div className='Modal'>
                <h1>Delete this report line?</h1>
                <div className='Buttons'>
                    <Button variant='contained' onClick={()=>setModalDelete(false)} disabled={deleting}>close</Button>
                    <Button variant='contained' color='error' onClick={deleteLine} disabled={deleting}>{deleting ? (<CircularProgress size={24}/>):(<>Delete</>)}</Button>
                </div>
            </div> }

            { modalDeleteReport && 
            <div className='Modal'>
            <h1>Delete this entire report?</h1>
            <div className='Buttons'>
                <Button variant='contained' onClick={()=>setModalDeleteReport(false)} disabled={deleting}>close</Button>
                <Button variant='contained' color='error' onClick={() => deleteReport()} disabled={deleting}>{deleting ? (<CircularProgress size={24}/>):(<>Delete</>)}</Button>
            </div>
            </div> }

            { imagesModal && <ImagesModal close={() => setImagesModal(false)} reportLineInfo={selected} update={getLines}/> }
            { filesModal && <FilesModal close={() => setFilesModal(false)} reportLineInfo={selected}/> }
            { modalEditLine && <EditReportLine close={() => setModalEditLine(false)} reportLineInfo={selected}/> }
            { editAttendanceModal && <EditAttendance close={() => setEditAttendanceModal(false)} note={selected.notes} reportKey={selected.report.id} personKey={selected.personId} reload={getAttendance}/> }
        </div>
    )
}

export const AddAtachments = ({close, lineId}) => {

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

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
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            console.log(err.response)
            setError(true)
        })
    }

    return(
        <div className="Modal">
            {contextHolder}
            <h1>select the files you want to upload</h1>
            <input type='file' multiple disabled={loading}/>
            { success && <h3 style={{color: 'green'}}>The files have been uploaded, if you want to upload more you can do so</h3> }
            { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
            <Button>{loading ? (<CircularProgress/>):(<>upload</>)}</Button>
            <Button variant='contained' color='error' onClick={close}>close</Button>
        </div>
    )
}

export const EditReportLine = ({close, reportLineInfo}) => {

    console.log(reportLineInfo)

    useEffect(() => {
        console.log('UseEffect')
    }, [])

    const {reportLineCategoryList} = useContext(AppContext)
    const [success, setSuccess] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(reportLineInfo.categoryId)
    const [messageApi, contextHolder] = message.useMessage();

    return(
        <div className="Modal">
            {contextHolder}
            <h1>Edit this report?</h1>
            { success ? (
                <>
                    <h1>The report has been Edited</h1>
                    <Button variant='contained' onClick={close}>close</Button>
                </>
            ):(
                <>
                    <TextField defaultValue={reportLineInfo.description} className='fields' label='Description' multiline></TextField>
                    <Select className='fields'
                        value={selectedCategory}
                        onChange={(e) => {setSelectedCategory(e.target.value)}}
                        defaultValue={reportLineInfo.categoryId}
                    >
                        {reportLineCategoryList.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                    <div className='Buttons'>
                        <Button variant='contained'>save</Button>
                        <Button variant='contained' color='error' onClick={close}>close</Button>
                    </div>
                </>
            ) }
        </div>
    )
}

export const EditReportInfo = ({reportInfo, close, update}) => {

    console.log(reportInfo)

    useEffect(() => {
        getStaffList()
    },[])

    const navigate = useNavigate()
    const [staffList, setStaffList] = useState([])
    const [staffSelected, setStaffSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    function getStaffList(){
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            response.data.data.map((item) => {
                let lastNames
                if(item.lastNames == null){lastNames = ''}else{lastNames = item.lastNames}
                const data = {
                    name: `${item.names} ${lastNames}`,
                    id: item.id
                }
                setStaffList(c => [...c, data])
            })
        }).catch((err => {
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        }))
    }

    function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        const data = {
            dateReported: {
                value: e.target[0].value,
            }   
        }
        console.log(data)
        axios.put(`${apiAddress}/api/reports/${reportInfo.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setSuccess(true)
        }).catch((err) => {
            setError(true)
            console.log(err.response)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            {contextHolder}
            {success ? (
                <>
                    <h1>Changes saved</h1>
                    <Button variant='contained' color='error' onClick={() => {close(); update()}}>close</Button>
                </>
            ):(<>
                <h1>Edit this report</h1>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date reported' disableFuture className='fields' disabled={loading} defaultValue={dayjs(reportInfo.dateReported)}/>
                </LocalizationProvider>
                { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
                <div className='Buttons'>
                    <Button variant='contained' type='submit' disabled={loading}>{ loading ? (<CircularProgress size={24}/>):(<>save</>) }</Button>
                    <Button variant='contained' color='error' onClick={close} disabled={loading}>Cancel</Button>
                </div>
            </>)}
        </form>
    )
}