import { Button, TextField, CircularProgress, Tooltip, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useState, useContext, useEffect } from "react";
import { apiAddress } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Personal = () => {

    useEffect(() => {getList(); getIdList()}, [])

    const navigate = useNavigate()
    const { accessToken } = useContext(AppContext)
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
        let DriverLicensePhotoId
        let PassportPhotoId
        
        if (e.target[11].value == ''){
            DriverLicensePhotoId = null
        }else{
            axios.post(`${apiAddress}/data/personal/license`, e.target[11].value, {headers: {'Authorization': `Session${accessToken}`}})
            .then((response) => {
                Driver
            })
        }

        if (e.target[12].value == ''){
            PassportPhotoId = null
        }

        const data = {
            Names: e.target[0].value,
            LastNames: e.target[2].value,
            DateOfBirth: Date(e.target[4].value),
            IdentificationTypeId: Number(e.target[7].value),
            IdentificationNumber: Number(e.target[9].value),
            DriverLicensePhotoId: DriverLicensePhotoId,
            PassportPhotoId: PassportPhotoId,
            PhoneNumber: e.target[13].value,
            ManagedProjects: e.target[15].value,
        }
        axios.put(`${apiAddress}/api/person/${selectedItem}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
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

    async function getList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/person`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setListLoadin(false)
                setListError(false)
                console.log(response.data.data)
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

    async function getIdList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/identificationtype`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                // console.log(response.data.data)
                if(response.data.data == null){
                    setIdList([{name: '', symbol: '', format: ''}])
                }else{
                    setIdList(response.data.data)
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
                                <Tooltip title='Edit'>
                                    <Button onClick={() => {setEditModal(true); setSelectedItem(item.id)}}> <ModeEditIcon/> </Button>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <Button color='error' onClick={() => {setDeleteModal(true); setSelectedItem(item.id)}}> <DeleteIcon/> </Button>
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
                                    {idList.map((item) => (
                                        <MenuItem value={item.id} key={item.id}>{item.symbol}</MenuItem>
                                    ))}
                                </Select>
                                <TextField type="text" sx={{width: '70%'}}/>
                            </div>
                            <div className="fields file">
                                <p>Driver licence photo:</p>
                                <input type="file" accept="image/*" id='DriverLicensePhoto'/>
                            </div>
                            <div className="fields file" style={{marginBottom: '15px'}}>
                                <p>Passport photo:</p>
                                <input type="file" accept="image/*" id='PassportPhoto'/>
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
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(true); setSelectedItem(0)}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Names'/>
                            <TextField label='LastNames'/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker/>
                            </LocalizationProvider>
                            <div>
                                <InputLabel id='idType'>Identification</InputLabel>
                                <Select label='Identificacion'>
                                    <MenuItem value='V'>V</MenuItem>
                                    <MenuItem value='J'>J</MenuItem>
                                    <MenuItem value='E'>E</MenuItem>
                                </Select>
                                <TextField type="text"/>
                            </div>
                            <div>
                                <p>Driver licence photo:</p>
                                <input type="file" />
                            </div>
                            <div>
                                <p>Passport photo:</p>
                                <input type="file" />
                            </div>
                            <TextField label='Phone'/>
                            <div>
                                <InputLabel id='ManagedProjects'>managed Projects</InputLabel>
                                <Select label='ManagedProjects' className="Select">
                                    <MenuItem value='V'>V</MenuItem>
                                    <MenuItem value='J'>J</MenuItem>
                                    <MenuItem value='E'>E</MenuItem>
                                </Select>
                            </div>
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
                            <Button variant="contained" color='error' onClick={() => {setDeleteModal(false); setSuccess(false); setSelectedItem(0); setLoading(false)}}>close</Button>
                        </>
                    ):(
                        <>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" onClick={handleDelete} disabled={loading}>{loading ? (<CircularProgress/>):(<>Delete</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setDeleteModal(false); setSelectedItem(0)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>
    )
}

export default Personal;