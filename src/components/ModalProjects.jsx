import { Button, TextField, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Fab, Tooltip, CircularProgress } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useState, useContext, useEffect } from "react"
import axios from "axios";
import { apiAddress } from '../globalResources'
import { AppContext } from "../context/AppContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { convertToISO } from "../functions";

export const ModalView = ({projectId, close}) => {

    useEffect(() => { getStatus(); getSiteState(); getReportList() },[])

    const navigate = useNavigate()
    const {accessToken} = useContext(AppContext)
    const [info, setInfo] = useState(projectId)
    console.log(projectId)
    const completed = new Date(info.completed)
    const started = new Date(info.started)
    const [status, setStatus] = useState()
    const [siteState, setSiteState] = useState()
    const [roleIdList, setRoleIdList] = useState([])
    const [reportList, setReportList] = useState([])

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

    function getRolelist(){
        console.log(roleId)
        axios.get(`${apiAddress}/api/identificationtype/${roleId}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
        }).catch((err) => {console.log(err.response)})
    }

    function getReportInfo(){
        info.reports.map((item) => {
            axios.get(`${apiAddress}/api/reports/${item}`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((response => {
                console.log(response.data)
                // setReportList([...reportList, response.data.data])
            }))
        })
    }

    const [addNote, setAddNote] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

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
                            {info.involvedPeople.map((item) => (<p key={item.id}>{item.personNames} {item.personLastNames} - {item.roleId}</p>))}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Budgets</AccordionSummary>
                        <AccordionDetails>
                            {info.budgets.map((item) => (<p>{`${item.productId} - (${item.totalSpent} used of ${item.quantity})`}</p>))}
                        </AccordionDetails>
                    </Accordion>
                    <Button sx={{'margin': '20px'}} variant='contained' color='error' onClick={() => setDeleteConfirmation(true)}>delete project</Button>
                </div>
                <div className="divider"></div>
                <div className='right'>
                    <h1>Reports</h1>
                        {info.reports.map((item) => (
                            <Accordion key={item} className="Accordion" variant="elevation">
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    {item}
                                </AccordionSummary>
                                <AccordionDetails>{item}</AccordionDetails>
                            </Accordion>
                        ))}
                </div>
            </div>
            
            <div className="Buttons">
                <Button variant='contained' onClick={() => setAddNote(true)}>Add report</Button>
                <Button variant="contained" color='error' onClick={close}>Close</Button>
            </div>

            { addNote && <AddReportModal close={() => setAddNote(false)} id={info.id}/> }
            { deleteConfirmation && <deleteModal close={ () => setAddNote(false) } projectKey={info.id}/> }
        </div>
    )
}

export const ModalEdit = ({close, projectKey}) => {

    useEffect(() => {getStaffList(); getProductList(); getStatusList(); getRolesList(); getSiteStateList()}, [])
    const navigate = useNavigate()

    const { accessToken } = useContext(AppContext)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [staffSelected, setStaffSelected] = useState('')
    const [roleSelected, setRoleSelected] = useState([])
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

    function addStaff(){
        setLoading(true)
        setError(false)
        const data = {
            "projectId": projectKey,
            "personId": staffSelected,
            "roleId": Number(roleSelected)
        }
        // console.log(data)
        axios.post(`${apiAddress}/api/project/involvements`, data, {headers: {'Authorization': `Session ${accessToken}`}})
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
        axios.post(`${apiAddress}/api/project`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
                setLoading(false)
            }
        }).catch((err) => {
            // console.log(err)
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
        axios.get(`${apiAddress}/api/projectstate`, {headers: {'Authorization': `Session ${accessToken}`}})
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
        axios.get(`${apiAddress}/api/projectrole`, {headers: {'Authorization': `Session ${accessToken}`}})
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
        axios.get(`${apiAddress}/api/sitestate`, {headers: {'Authorization': `Session ${accessToken}`}})
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
                <form className="Modal" onSubmit={handleUpdate}>
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
                            {statusList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
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
                            {staffList.map((item) => <MenuItem value={item.id}>{item.names}</MenuItem> )}
                        </Select>
                        <Select className="select" id='RoleSelector' onChange={(e) => setRoleSelected(e.target.value)} disabled={loading}>
                            {rolesList.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem> )}
                        </Select>
                        <Tooltip title='Add staff'>
                            <Fab color='info' onClick={addStaff} disabled={loading}><AddIcon/></Fab>
                        </Tooltip>
                    </div>
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

    const { accessToken } = useContext(AppContext)
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
        axios.post(`${apiAddress}/api/project`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
                setLoading(false)
            }
        }).catch((err) => {
            // console.log(err)
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
                    <Button variant='contained' color='error' onClick={() => {close; getList()}}>close</Button>
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

export const AddReportModal = ({close, id}) => {

    useEffect(() => { getCategoryList() }, [])

    const today = new Date()
    const projectId = id
    const navigate = useNavigate()
    const { accessToken, userInfo } = useContext(AppContext)
    const [success, setSuccess] = useState(false)
    const date = new Date()
    const [categoryList, setCategoryList] = useState([])
    const [categorySelected, setCategorySelected] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCategory = (e) => {
        setCategorySelected(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        const reportData = {
            reporterUserId: userInfo.id,
            projectId: projectId,
            dateReported: today.toDateString()
        }
        const productData = {
            "reportId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "productId": 0,
            "quantity": 0
        }
        axios.post(`${apiAddress}/api/reports/`, reportData, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            const lineData = {
                "reportId": response.data.data[0].id,
                "description": LineText.value,
                "categoryId": Number(categorySelected)
            }
            axios.post(`${apiAddress}/api/reports/lines`, lineData, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((subResponse1) => {
                console.log(subResponse1)
            })
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setError(true)
        })
    }

    function getCategoryList(){
        axios.get(`${apiAddress}/api/reports/lines/categories`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.data.data == null){
                setCategoryList([{name: ''}])
            }else{
                setCategoryList(response.data.data)
            }
        }).catch((err) => {
            console.log(err.response)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Report added</h1>
                    <Button variant='contained' color='error' onClick={close}>Close</Button>
                </div>
            ):(
                <form className='Modal' onSubmit={handleSubmit}>
                    <div className="header">
                        <div className='category'>
                            <h1>Category: </h1>
                            <Select
                                label='category'
                                onChange={handleCategory}
                                id='category'
                                value={categorySelected}
                                disabled={loading}
                            >
                                {categoryList.map((item) => (<MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>))}
                            </Select>
                        </div>

                        <Tooltip title='Add report'>
                            <Fab color='info' type='submit'>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </div>
                    <div className="info">
                        <div>
                            
                        </div>
                    
                        <TextField multiline label='Notes' id='LineText'/>
                        <input type='file' multiple/>
                    </div>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </form>
            ) }
        </>
    )
}

export const deleteModal = ({close, projectKey}) => {
    const [success, setSuccess] = useState(false)

    async function handleDelete(){
        e.preventDefault()
        axios.delete(`${apiAddress}/api/report/${projectKey}`)
        .then((response) => {
            setSuccess(true)
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
                    <h1>The project has been deleted</h1>
                    <Button variant='contained' color='error' onClick={close}>Close</Button>
                </div>
            ):(
                <div className='Modal'>
                    <Button variant='contained' onClick={handleDelete}>Delete</Button>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </div>
            ) }
        </>
    )
}