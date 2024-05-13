import { Button, TextField, CircularProgress, Tooltip, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useContext, useEffect } from "react";
import { apiAddress, accessToken } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getItem } from '../functions'
import dayjs from "dayjs";

const Personal = () => {

    useEffect(() => {getList()}, [])

    const { idTypeList } = useContext(AppContext)
    const navigate = useNavigate()
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [listError, setListError] = useState(false)
    const [listLoading, setListLoadin] = useState(true)
    const [list, setList] = useState([])
    const [idList, setIdList] = useState([])
    const [idType, setIdType] = useState(0)
    const [selectedItem, setSelectedItem] = useState(0)
    const [viewModal, setViewModal] = useState(false)
    const [passportImage, setPassportImage] = useState('')
    const [identificationToShow, setIdentificationToShow] = useState('')
    const [count, setCount] = useState(16)
    const [deleteKey, setDeleteKey] = useState('')
    const [deleteReady, setDeleteReady] = useState(false)

    useEffect(() => {
        const decrease = setInterval(() => {
            if(count > 0){
                setCount(count -1)
            }else if(count == 0){
                setDeleteReady(true)
            }
        }, 1000)
        return () => clearInterval(decrease)
    }, [count])

    async function getDeleteKey(){
        response = await axios.delete(`${apiAddress}/api/person/${selectedItem}`, {headers: {'Authorization': `Session ${accessToken}`}})
        setDeleteKey(response.data.data[0])
    }

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        let DriverLicensePhotoId
        let PassportPhotoId

        if (e.target[11].value == ''){
            DriverLicensePhotoId = null
        }else{
            console.log(e.target.files[0])
        }

        if (e.target[12].value == ''){
            PassportPhotoId = null
        }

        const data = {
            Names: e.target[0].value,
            LastNames: e.target[2].value,
            DateOfBirth: e.target[4].value,
            IdentificationTypeId: Number(e.target[7].value),
            IdentificationNumber: Number(e.target[9].value),
            DriverLicensePhotoId: DriverLicensePhotoId,
            PassportPhotoId: PassportPhotoId,
            PhoneNumber: e.target[13].value,
        }
        console.log(data)
        axios.post(`${apiAddress}/api/person`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            if(response.status){
                setSuccess(true)
            }
        })
        .catch((err) => {
            setLoading(false)
            setError(true)
            console.log(err.response.data)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function handleDelete(){
        setError(false)
        setLoading(true)
        axios.delete(`${apiAddress}/api/person/${selectedItem}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status == 200){
            setSuccess(true)
            }
        })
        .catch((err) => {
            setLoading(false)
            setError(true)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function handleUpdate(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        let Names
        let LastNames
        let DateOfBirth
        let IdentificationTypeId
        let IdentificationNumber
        let DriverLicensePhotoId
        let PassportPhotoId
        let PhoneNumber
        let ManagedProjects
        const licenseInput = document.getElementById('license')
        const passportInput = document.getElementById('passport')
        
        if(e.target[0].value == ''){Names = null}else{Names = e.target[0].value}
        if(e.target[2].value == ''){LastNames = null}else{LastNames = e.target[2].value}
        if(e.target[4].value == ''){DateOfBirth = null}else{DateOfBirth = e.target[4].value}
        if(e.target[7].value == ''){IdentificationTypeId = null}else{IdentificationTypeId = Number(e.target[7].value)}
        if(e.target[9].value == ''){IdentificationNumber = null}else{IdentificationNumber = Number(e.target[9].value)}
        if (e.target[11].value == ''){ DriverLicensePhotoId = null}else{
            axios.post(`${apiAddress}/data/personal/license`, licenseInput.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image/png'}})
            .then(async (response) => {
                DriverLicensePhotoId = await response.data.data[0].key
            }).catch((err) => {
                console.log(err.response.data)
            })
        }
        if (e.target[12].value == ''){ PassportPhotoId = null }else{
            axios.post(`${apiAddress}/data/personal/identification`, passportInput.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image/png'}})
            .then(async (response) => {
                PassportPhotoId = await response.data.data[0].key
            }).catch((err) => {
                console.log(err.response.data)
            })
        }
        if(e.target[13].value == ''){PhoneNumber = null}else{PhoneNumber = e.target[13].value}
        if(e.target[15].value == ''){ManagedProjects = null}else{ManagedProjects = e.target[15].value}

        const data = {
            names: Names,
            lastNames: LastNames,
            DateOfBirth: {
                value: DateOfBirth,
            },
            IdentificationTypeId: {
                value: IdentificationTypeId,
            },
            IdentificationNumber: {
                value: IdentificationNumber,
            },
            DriverLicensePhotoId: {
                value: DriverLicensePhotoId,
            },
            PassportPhotoId: {
                value: PassportPhotoId,
            },
            PhoneNumber: PhoneNumber,
            ManagedProjects: null,
        }
        console.log(data)
        axios.put(`${apiAddress}/api/person/${selectedItem.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
            }
        }).catch((err) => {
            console.log(err.response)
            setLoading(false)
            setError(true)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setListLoadin(false)
                setListError(false)
                if(response.data.data == null){
                    setList([{name: ''}])
                }else{
                    setList(response.data.data)
                }
            }
        })
        .catch((err) => {
            setListError(true)
            setListLoadin(false)
            console.log(err)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <div className='Personal'>
            <h1>Person Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new Person</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
                <div>
                    {list.map((item) => (
                        <div className='LI' key={item.id}>
                            <h3>{item.names} {item.lastNames}</h3>
                            <div className="Buttons">
                            <Tooltip title='See info'>
                                    <Button onClick={() => {setViewModal(true); setSelectedItem({...item, idType: getItem(item.identificationTypeId, idTypeList).symbol}) }}> <VisibilityIcon/> </Button>
                                </Tooltip>
                                <Tooltip title='Edit'>
                                    <Button onClick={() => {setEditModal(true); setSelectedItem(item); setIdType(item.identificationTypeId)}}> <ModeEditIcon/> </Button>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <Button color='error' onClick={() => {setDeleteModal(true); setSelectedItem(item.id); getDeleteKey(); setCount(16); setDeleteReady(false)}}> <DeleteIcon/> </Button>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            }

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add New Person</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(false); setLoading(false); getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Names' type="text" className="fields"/>
                            <TextField label='Lastnames' className="fields"/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label='Date of birth' format="YYYY/MM/DD" disableFuture className="fields"/>
                            </LocalizationProvider>
                            <div className="fields">
                                <InputLabel id='idType'>Identification</InputLabel>
                                <Select label='Identificacion' value={idType} onChange={(e) => setIdType(e.target.value)} sx={{width: '30%'}}>
                                    {idTypeList.map((item) => (
                                        <MenuItem value={item.id} key={item.id}>{item.symbol}</MenuItem>
                                    ))}
                                </Select>
                                <TextField type="text" sx={{width: '70%'}}/>
                            </div>
                            <div className="fields file">
                                <p>Driver licence photo:</p>
                                <input type="file" accept="image/*" id='DriverLicensePhoto' disabled={true}/>
                            </div>
                            <div className="fields file" style={{marginBottom: '15px'}}>
                                <p>Passport photo:</p>
                                <input type="file" accept="image/*" id='PassportPhoto' disabled={true}/>
                            </div>
                            <TextField label='Phone' className="fields"/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setAddModal(false); setError(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { editModal && 
                <form className="Modal" onSubmit={handleUpdate}>
                    <h1>Edit Person</h1>
                    {success ? (
                        <>
                            <h1>Edited Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setEditModal(false); setSuccess(false); setSelectedItem(0); getList(); setLoading(false)}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Names' disabled={loading} defaultValue={selectedItem.names} className="fields"/>
                            <TextField label='LastNames'disabled={loading} defaultValue={selectedItem.lastNames} className="fields"/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker disabled={loading} defaultValue={dayjs(selectedItem.dateOfBirth)} className="fields" format="YYYY/MM/DD" disableFuture/>
                            </LocalizationProvider>
                            <div className="fields">
                                <InputLabel id='idType'>Identification</InputLabel>
                                <Select
                                    label='Identificacion'
                                    value={idType}
                                    onChange={(e) => setIdType(e.target.value)}
                                    sx={{width: '30%'}}
                                >
                                    {idTypeList.map((item) => (
                                        <MenuItem value={item.id} key={item.id}>{item.symbol}</MenuItem>
                                    ))}
                                </Select>
                                <TextField type="text" disabled={loading} defaultValue={selectedItem.identificationNumber} sx={{width: '70%'}}/>
                            </div>
                            <div className="fields file">
                                <p>Driver licence photo:</p>
                                <input type="file" id='license' disabled={true}/>
                            </div>
                            <div className="fields file" style={{marginBottom: '15px'}}>
                                <p>Passport photo:</p>
                                <input type="file" id='passport' disabled={true}/>
                            </div>
                            <TextField label='Phone' disabled={loading} defaultValue={selectedItem.phoneNumber} className="fields"/>
                            {/* <div>
                                <InputLabel id='ManagedProjects'>managed Projects</InputLabel>
                                <Select label='ManagedProjects' className="Select">
                                    <MenuItem value='V'>V</MenuItem>
                                    <MenuItem value='J'>J</MenuItem>
                                    <MenuItem value='E'>E</MenuItem>
                                </Select>
                            </div> */}
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setEditModal(false); setError(false); setSelectedItem(0)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { deleteModal && 
                <form className="Modal">
                    <h1>Delete this Person?</h1>
                    {success ? (
                        <>
                            <h1>Deleted Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setDeleteModal(false); setSuccess(false); setSelectedItem(0); setLoading(false); getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" onClick={handleDelete} disabled={loading || !deleteReady}>{loading ? (<CircularProgress/>):(<>Delete {count}</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setDeleteModal(false); setSelectedItem(0)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { viewModal && 
                <div className='Modal'>
                    <h1>Person information</h1>
                    <h3>Names: {selectedItem.names}</h3>
                    <h3>Last names: {selectedItem.lastNames}</h3>
                    <h3>Date Of Birth: {new Date(selectedItem.dateOfBirth).toDateString()}</h3>
                    <h3>Identification: {selectedItem.idType} {selectedItem.identificationNumber}</h3>
                    <h3>Phone: {selectedItem.phoneNumber}</h3>
                    <Button variant='contained' onClick={() => {setViewModal(false)}}>close</Button>
                </div>
            }
        </div>
    )
}

export default Personal;