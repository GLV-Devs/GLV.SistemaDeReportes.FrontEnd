import { Button, TextField, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Fab, Tooltip, CircularProgress, InputLabel, Skeleton } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useContext, useEffect } from "react"
import axios from "axios";
import { apiAddress, accessToken } from '../globalResources'
import { AppContext } from "../context/AppContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { convertToISO, getRoleName, getProductName } from "../functions";
import { ViewReport, EditReportInfo } from "./ModalReports";
import dayjs from "dayjs";

export const ModalView = ({projectId, close, updateList}) => {

    useEffect(() => { getStatus(); getSiteState(), getReportList() },[])

    const {userInfo} = useContext(AppContext)
    const navigate = useNavigate()
    const [info, setInfo] = useState(projectId)
    console.log(projectId)
    const completed = new Date(info.completed)
    const started = new Date(info.started)
    const [status, setStatus] = useState()
    const [siteState, setSiteState] = useState()
    const [selectedReport, setSelectedReport] = useState('')
    const [reportList, setReportList] = useState([])
    const [seeReportModal, setSeeReportModal] = useState(false)
    const [editReportModal, setEditReportModal] = useState(false)
    const [loadingReports, setLoadingReports] = useState(true)
    const [addingReport, setAddingReport] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

    async function getStatus(){
        axios.get(`${apiAddress}/api/project/states/${info.stateId}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setStatus(response.data.data[0].name)
        }).catch((err) => {
            // console.log(err.response)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getSiteState(){
        axios.get(`${apiAddress}/api/sites/state/${info.siteStateId}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setSiteState(response.data.data[0].name)
        }).catch((err) => {
            // console.log(err.response)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    function addNewReport(){
        setAddingReport(true)
        const date = new Date()
        const data = {
            "reporterUserId": userInfo.id,
            "projectId": info.id,
            "dateReported": `${(`${date.getMonth()+1}`).padStart(2, '0')}/${(`${date.getDate()}`).padStart(2, '0')}/${date.getFullYear()}`
        }
        axios.post(`${apiAddress}/api/reports`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status = 201){
                let lastNames
                if(response.data.data[0].reporterUser.lastNames == null){lastNames = ''}else{lastNames = response.data.data[0].reporterUser.lastNames}
                const reporterUser = response.data.data[0].reporterUser.names + lastNames
                setReportList([...reportList, {
                    reporterUser: reporterUser,
                    dateReported: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                    id: response.data.data[0].id
                }])
                setAddingReport(false)
            }
        }).catch((err) => {
            console.log(err)
            setAddingReport(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    function getReportList(){
        let temp = []
        projectId.reports.map(async(item) => {
            let lastNames
            const date = new Date(item.dateReported)
            axios.get(`${apiAddress}/api/person/${item.reporterUserId}`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((response) => {
                if(response.data.data[0].lastNames == null){lastNames = ''}else{lastNames = response.data.data[0].lastNames}
                const reporterUser = response.data.data[0].names + lastNames
                temp = [...temp, {
                    reporterUser: reporterUser,
                    dateReported: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                    id: item.id
                }]
                setReportList(temp)
            })
        })
        setLoadingReports(false)
    }

    return(
        <div className='ModalDual'>
            <div className='content'>
                <div className='left'>
                    <h1>Info</h1>
                    <h3>Name: <span>{info.name}</span></h3>
                    <h3>Address: <span>{info.address}</span></h3>
                    <h3>Completed: <span>{completed.toDateString()} - {completed.toLocaleTimeString()}</span></h3>
                    <h3>Started: <span>{started.toDateString()} - {started.toLocaleTimeString()}</span></h3>
                    <h3>Estimated Time: <span>{info.eta}</span></h3>
                    <h3>Project status: <span>{status}</span></h3>
                    <h3>Site state: <span>{siteState}</span></h3>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Staff</AccordionSummary>
                        <AccordionDetails>
                            {info.involvedPeople.map((item) => (<p key={item.id}>{item.personNames} {item.personLastNames} - {getRoleName(item.roleId)}</p>))}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Budgets</AccordionSummary>
                        <AccordionDetails>
                            {info.budgets.map((item) => (<p>{`${getProductName(item.productId)} - (${item.totalSpent} used of ${item.quantity})`}</p>))}
                        </AccordionDetails>
                    </Accordion>
                    <Button sx={{'margin': '20px'}} variant='contained' color='error' onClick={() => setDeleteConfirmation(true)}>delete project</Button>
                </div>
                <div className="divider"></div>
                <div className='right'>
                    <h1>Reports</h1>
                    { loadingReports ? (
                        <>
                            <Skeleton width={500} height={60} animation='wave'></Skeleton>
                            <Skeleton width={500} height={60} animation='wave'></Skeleton>
                            <Skeleton width={500} height={60} animation='wave'></Skeleton>
                            <Skeleton width={500} height={60} animation='wave'></Skeleton>
                            <Skeleton width={500} height={60} animation='wave'></Skeleton>
                        </>
                    ):(
                        <>
                            {reportList.map((item) => (
                                <div className='ReportListItem' key={item.id}>
                                    <h3>{item.dateReported} - {item.reporterUser}</h3>
                                    <div className="Buttons">
                                        {/* ver reporte: muestra la info de viewReporte */}
                                        <Tooltip title='See report'>
                                            <Button onClick={() => {setSelectedReport(item.id); setSeeReportModal(true); console.log(item.id)}}> <VisibilityIcon/> </Button>
                                        </Tooltip>
                                        {/* editar reporte: edita quien lo reporta y la fecha */}
                                        <Tooltip title='Edit report'>
                                            <Button onClick={() => {setEditReportModal(true); setSelectedReport(item.id)}}> <ModeEditIcon/> </Button>
                                        </Tooltip>
                                        {/* dentro de ver reportes se manejan las lineas tal y como ya estan
                                        y se abrira un modal para los atachment */}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) }

                        
                </div>
            </div>
            
            <div className="modalButtons Buttons">
                <Button variant='contained' onClick={() => addNewReport()} disabled={addingReport}>{addingReport ? (<CircularProgress size={24}/>):(<>Add report</>)}</Button>
                <Button variant="contained" color='error' onClick={close}>Close</Button>
            </div>

            { deleteConfirmation && <DeleteModal close={ () => setDeleteConfirmation(false) } projectKey={info.id} closeAll={close} updateList={updateList}/> }
            { seeReportModal && <ViewReport close={() => {setSeeReportModal(false)}} reportKey={selectedReport}/> }
            { editReportModal && <EditReportInfo close={(setEditReportModal(false))} projectKey={selectedReport}/> }
        </div>
    )
}

export const ModalEdit = ({close, projectInfo}) => {

    useEffect(() => {getStaffList()}, [])
    const navigate = useNavigate()

    const { productList, projectStateList, rolesList, siteStateList } = useContext(AppContext)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [staffSelected, setStaffSelected] = useState('')
    const [roleSelected, setRoleSelected] = useState([])
    const [materialSelected, setMaterialSelected] = useState('')
    const [qttySelected, setQttySelected] = useState([])
    const [staffList, setStaffList] = useState([])
    const [siteState, setSiteState] = useState('')

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const handleSiteState = (e) => {
        setSiteState(e.target.value)
    }

    function addStaff(){
        setLoading(true)
        setError(false)
        const data = {
            "projectId": projectInfo.id,
            "personId": staffSelected,
            "roleId": Number(roleSelected)
        }
        console.log(data)
        axios.post(`${apiAddress}/api/projects/involvements`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setLoading(false)
            setStaffSelected('')
            setRoleSelected('')
        }).catch((err) => {
            setError(true)
            setLoading(false)
            console.log(err.response.data)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    function addBudget(){
        setLoading(true)
        setError(false)
        const data = {
            "productId": materialSelected,
            "projectId": projectKey,
            "quantity": qttySelected
        }
        axios.post(`${apiAddress}/api/project/budget`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setLoading(false)
            setMaterialSelected('')
            setQttySelected(0)
        }).catch((err) => {
            setError(true)
            setLoading(false)
            console.log(err.response.data)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    function handleUpdate(e){
        e.preventDefault()
        // console.log(projectInfo.id)
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            address: e.target[2].value,
            eta: {
                value: e.target[4].value,
            },
            started: {
                value: convertToISO(e.target[7].value),
            },
            completed: {
                value: convertToISO(e.target[10].value),
            },
            stateId: {
                value: Number(e.target[13].value),
            },
            siteStateId: {
                value: Number(e.target[15].value),
            },
            contractorLogoId: null,
            clientLogoId: null,
        }
        console.log(data)
        axios.put(`${apiAddress}/api/projects/${projectInfo.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err.response)
            setError(true)
            setLoading(false)
            if(err.response.status == 401){
                navigate('/login')
            }
        })
    }

    async function getStaffList(){
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                // console.log(response.data.data)
                if(response.data.data == null){
                    setStaffList([{name: ''}])
                }
                setStaffList(response.data.data)
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Project edited</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleUpdate}>
                    <h1>Add Project</h1>
                    <TextField label='Name' className='fields' disabled={loading} defaultValue={projectInfo.name}/>
                    <TextField label='Address' className='fields' disabled={loading} defaultValue={projectInfo.address}/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label='Estimated Time' format="DD/MM/YYYY" className='fields' disabled={loading} defaultValue={dayjs(projectInfo.eta)}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker label='Started' format="MM/DD/YYYY hh:mm a" className='fields' disabled={loading} defaultValue={dayjs(projectInfo.started)}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker label='Completed' format="MM/DD/YYYY hh:mm a" className='fields' disabled={loading} defaultValue={dayjs(projectInfo.completed)}/>
                    </LocalizationProvider>
                    <div className="Select fields">
                        <p style={{width: '35%'}}>Project status:</p>
                        <Select
                            label='Estado'
                            onChange={handleSiteState}
                            value={siteState}
                            sx={{width: '65%'}}
                            disabled={loading}
                        >
                            {projectStateList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                    </div>
                    <div className="Select fields">
                        <p style={{width: '35%'}}>Site State:</p>
                        <Select
                            onChange={handleStatus}
                            value={status}
                            sx={{width: '65%'}}
                            disabled={loading}
                        >
                            {siteStateList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                    </div>
                    <p style={{position: 'relative', right: '32%'}}>Staff:</p>
                    <div className='staffSelect fields' >
                        <Select label='Staff' className="select" id='StaffSelector' onChange={(e) => setStaffSelected(e.target.value)} disabled={loading}>
                            {staffList.map((item) => <MenuItem value={item.id}>{item.names} {item.lastNames}</MenuItem> )}
                        </Select>
                        <Select className="select" id='RoleSelector' onChange={(e) => setRoleSelected(e.target.value)} disabled={loading}>
                            {rolesList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                        <Tooltip title='Add staff'>
                            <Fab color='info' onClick={addStaff} disabled={loading}><AddIcon/></Fab>
                        </Tooltip>
                    </div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Options</th>
                        </tr>
                        projectInfo.involvedPeople.map((item) => {
                            <tr>
                                <td>{item.personNames} {item.personLastNames}</td>
                                <td>{item.roleId}</td>
                                <td>
                                    <Tooltip title='Edit'>
                                        <IconButton> <ModeEditIcon/> </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Delete'>
                                        <IconButton> <DeleteIcon/> </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        })
                    </table>
                    <p style={{position: 'relative', right: '30%'}}>Materials:</p>
                    <div className='materialSelect' >
                        <Select className="select" id='MaterialSelector' onChange={(e) => setMaterialSelected(e.target.value)} disabled={loading}>
                            {productList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                        <TextField label='Quantity' className="select" type='number' disabled={loading} onChange={(e) => setQttySelected(e.target.value)}/>
                        <Tooltip title='Add material'>
                            <Fab color='info' onClick={addBudget} disabled={loading}><AddIcon/></Fab>
                        </Tooltip>
                    </div>
                        {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                    <div className='Buttons'>
                        <Button variant='contained' type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>Save</>)}</Button>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>close</Button>
                    </div>
                </form>
            ) }
        </>
    )
}

export const ModalAdd = ({close}) => {

    useEffect(() => {getStaffList(); getProductList(); getStatusList(); getRolesList(); getSiteStateList()}, [])
    const navigate = useNavigate()

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [staff, setStaff] = useState([])
    const [staffSelected, setStaffSelected] = useState('')
    const [roleSelected, setRoleSelected] = useState([])
    const [material, setMaterial] = useState([])
    const [materialSelected, setMaterialSelected] = useState('')
    const [qttySelected, setQttySelected] = useState([])
    const [staffList, setStaffList] = useState([])
    const [productList, setProductList] = useState([])
    const [statusList, setStatusList] = useState([])
    const [rolesList, setRolesList] = useState([])
    const [siteStateList, setSiteStateList] = useState([])
    const [siteState, setSiteState] = useState('')

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const handleSiteState = (e) => {
        setSiteState(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            address: e.target[2].value,
            eta: e.target[4].value,
            started: convertToISO(e.target[7].value),
            completed: convertToISO(e.target[10].value),
            stateId: Number(e.target[13].value),
            siteStateId: Number(e.target[15].value),
            contractorLogoId: null,
            clientLogoId: null,
        }
        // console.log(data)
        axios.post(`${apiAddress}/api/projects`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
            setError(true)
            setLoading(false)
            if(err.response.status == 401){
                navigate('/login')
            }
        })
    }

    async function getStaffList(){
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                // console.log(response.data.data)
                if(response.data.data == null){
                    setStaffList([{name: ''}])
                }
                setStaffList(response.data.data)
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getProductList(){
        axios.get(`${apiAddress}/api/product`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                // console.log(response.data.data)
                if(response.data.data == null){
                    setProductList([{name: ''}])
                }else{
                    setProductList(response.data.data)
                }
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getStatusList(){
        axios.get(`${apiAddress}/api/project/states`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                if(response.data.data == null){
                    setStatusList([{name: ''}])
                }else{
                    setStatusList(response.data.data)
                }
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getRolesList(){
        axios.get(`${apiAddress}/api/project/roles`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                if(response.data.data == null){
                    setRolesList([{name: ''}])
                }else{
                    setRolesList(response.data.data)
                }
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getSiteStateList(){
        axios.get(`${apiAddress}/api/sites/state`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                if(response.data.data == null){
                    setSiteStateList([{name: ''}])
                }else{
                    setSiteStateList(response.data.data)
                }
            }
        }).catch((err) => {
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Project added</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add Project</h1>
                    <TextField label='Name' className='fields' disabled={loading}/>
                    <TextField label='Address' className='fields' disabled={loading}/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label='Estimated Time' format="DD/MM/YYYY" className='fields' disabled={loading}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker label='Started' format="MM/DD/YYYY hh:mm a" className='fields' disabled={loading}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker label='Completed' format="MM/DD/YYYY hh:mm a" className='fields' disabled={loading}/>
                    </LocalizationProvider>
                    <div className="Select fields">
                        <p style={{width: '35%'}}>Project status:</p>
                        <Select
                            label='Estado'
                            onChange={handleSiteState}
                            value={siteState}
                            sx={{width: '65%'}}
                            disabled={loading}
                        >
                            {statusList.map((item) => <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem> )}
                        </Select>
                    </div>
                    <div className="Select fields">
                        <p style={{width: '35%'}}>Site State:</p>
                        <Select
                            onChange={handleStatus}
                            value={status}
                            sx={{width: '65%'}}
                            disabled={loading}
                        >
                            {siteStateList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                    </div>
                        {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                    <div className='Buttons'>
                        <Button variant='contained' type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>Save</>)}</Button>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>close</Button>
                    </div>
                </form>
            ) }
        </>
    )
}

export const DeleteModal = ({closeAll, projectKey, close, updateList}) => {

    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [ready, setReady] = useState(false)
    const [count, setCount] = useState(20)
    const [deleteKey, setDeleteKey] = useState('')

    useEffect(() => {
        getDeleteKey()
    }, [])

    useEffect(() => {
        const decrease = setInterval(() => {
            if(count > 0){
                setCount(count - 1)
            }else if (count == 0){
                setReady(true)
            }
        }, 1000)
        return () => clearInterval(decrease)
    }, [count])

    async function getDeleteKey(){
        let response = await axios.delete(`${apiAddress}/api/projects/${projectKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        setDeleteKey(response.data.data[0])
    }

    async function handleDelete(){
        setDeleting(true)
        axios.delete(`${apiAddress}/api/projects/?token=${deleteKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            if(response.status == 200){
                setDeleting(false)
                setError(false)
                setReady(false)
                setSuccess(true)
            }
        }).catch((err) => {
            setError(true)
            setDeleting(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
            console.log(err.response)
        })
    }

    return(
        <div className='Modal'>
            <h1>Delete this project?</h1>
            { success ? (
                <>
                    <h3>The project has been deleted</h3>
                    <Button variant='contained' color='error' onClick={() => {closeAll(); updateList()}}>close</Button>
                </>
            ):(
                <>
                    <div className='Buttons'>
                        <Button variant='contained' onClick={handleDelete} disabled={deleting || !ready}>
                            {deleting ? (<CircularProgress size={24}/>):(<>Delete {count}</>)}
                        </Button>
                        <Button variant='contained' color='error' onClick={close} disabled={deleting}>Cancel</Button>
                    </div>
                    { error && <h3 style={{'color': 'red'}}>An error has ocurred</h3> }
                </>
            ) }
        </div>
    )
}

export const ExportModal = ({projectId, close}) => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function getGeneralReport(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        setSuccess(false)
        const data = {
            projectKey: projectId,
            start: e.target[0].value,
            end: e.target[3].value,
        }
        console.log(data)
        const PDFkey = await axios.post(`${apiAddress}/data/export/project/general/pdf`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        axios.get(`${apiAddress}/data/export/project/general/download/?token=${PDFkey.data.data[0]}`, {headers: {'Authorization': `Session ${accessToken}`}, responseType: 'blob'})
        .then((response=>{
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href=url
            link.setAttribute('download','ticket.pdf')
            document.body.appendChild(link)
            link.click()
        })).catch(error=>{
            setError(true)
            console.log(error)
        })
        setLoading(false)

    }

    return(
        <form className="Modal" onSubmit={getGeneralReport}>
            <h1>Export general report</h1>
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker id='since' label='Export from' disabled={loading}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker id='to' label='to' disabled={loading}/>
                </LocalizationProvider>
            </div>
            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
            {success && <h3 style={{color: 'green'}}>General report has been exported</h3>}
            <div className='Buttons'>
                <Button variant='contained' type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>export</>)}</Button>
                <Button variant='contained' color='error' onClick={close} disabled={loading}>close</Button>
            </div>
        </form>
    )
}