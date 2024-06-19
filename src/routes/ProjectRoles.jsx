import { Button, TextField, CircularProgress, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { apiAddress, accessToken } from "../globalResources";
import { useNavigate } from "react-router-dom";

const ProjectRoles = () => {

    const navigate = useNavigate()
    const {rolesList, setRolesList} = useContext(AppContext)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [listError, setListError] = useState(false)
    const [listLoading, setListLoadin] = useState(false)
    const [selectedItem, setSelectedItem] = useState(0)

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            level: Number(e.target[2].value)
        }
        axios.post(`${apiAddress}/api/project/roles`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
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

    async function handleDelete(){
        setError(false)
        setLoading(true)
        axios.delete(`${apiAddress}/api/project/roles/${selectedItem}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
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
        let name
        if(e.target[0].value == ''){
            name = null
        }else{ name = e.target[0].value }
        const data = {
            name: name,
            level: {
                value: Number(e.target[2].value)
            }
        }
        axios.put(`${apiAddress}/api/project/roles/${selectedItem.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
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
        axios.get(`${apiAddress}/api/project/roles`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setListLoadin(false)
                setListError(false)
                if(response.data.data == null){
                    setRolesList([{name: ''}])
                }else{
                    setRolesList(response.data.data)
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
        <div className='ProjectRoles'>
            <h1>Project Roles Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new project role</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
                <div>
                    {rolesList.map((item) => (
                        <div className='LI' key={item.id}>
                            <h3>{item.name}</h3>
                            <div className='Buttons'>
                                <Tooltip title='Edit'>
                                    <Button onClick={() => {setEditModal(true); setSelectedItem(item)}}> <ModeEditIcon/> </Button>
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
                    <h1>Add New Project Role</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(false); setLoading(false); getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            <Tooltip title='Higher levels mean more authority, this is only for the purpose of controlling PDF exports'>
                                <TextField type="number" label='Level' disabled={loading}/>
                            </Tooltip>
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
                    {success ? (
                        <>
                            <h1>Edited Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setEditModal(false); setSuccess(false); setSelectedItem(0); setError(false); getList(); setLoading(false)}}>close</Button>
                        </>
                    ):(
                        <>
                            <h1>Edit Project Role</h1>
                            <TextField label='Name' disabled={loading} defaultValue={selectedItem.name}/>
                            <Tooltip title='Higher levels mean more authority, this is only for the purpose of controlling PDF exports'>
                                <TextField type='number' label='Level' disabled={loading} defaultValue={selectedItem.level.value}/>
                            </Tooltip>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setEditModal(false); setSelectedItem(0); setError(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { deleteModal && 
                <form className="Modal">
                    <h1>Delete this Project Role?</h1>
                    {success ? (
                        <>
                            <h1>Deleted Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setDeleteModal(false); setSuccess(false); setSelectedItem(0); getList(); setLoading(false)}}>close</Button>
                        </>
                    ):(
                        <>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" onClick={handleDelete} disabled={loading}>{loading ? (<CircularProgress/>):(<>Delete</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setDeleteModal(false); setSelectedItem(0); setError(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>  
    )
}

export default ProjectRoles;