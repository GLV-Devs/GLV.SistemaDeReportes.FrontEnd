import { Button, TextField, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from "axios";
import { useState } from "react";
import { apiAddress } from "../globalResources";

const ProjectStates = () => {

    const [addModal, setAddModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const infoPrueba = [{
        name: 'Activo'
    },{
        name: 'Concluido'
    },{
        name: 'En progreso'
    },]

    async function handleDelete(){
        setError(false)
        setLoading(true)
        axios.delete(`${apiAddress}/api/projectstate`)
        .then((response) => {
            if(response.status == 200){
            setSuccess(true)
            }
        })
        .catch((err) => {
            if(err){
                setLoading(false)
                setError(true)
            }
        })
    }

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
        }
        axios.post(`${apiAddress}/api/projectstate`, data)
        .then((response) => {
            if(response.status == 200){
                setSuccess(true)
            }
        })
        .catch((err) => {
            if(err){
                setLoading(false)
                setError(true)
            }
        })
    }

    async function handleUpdate(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
        }
        axios.put(`${apiAddress}/api/projectstate`, data)
        .then((response) => {
            if(response.status == 200){
                setSuccess(true)
            }
        })
        .catch((err) => {
            if(err){
                setLoading(false)
                setError(true)
            }
        })
    }

    return(
        <div className='ProjectStates'>
            <h1>Project States Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new project state</Button>
            <div >
                {infoPrueba.map((item) => (
                    <div className='LI'>
                        <h3>{item.name}</h3>
                        <div>
                            <Button onClick={() => setEditModal(true)}> <ModeEditIcon/> </Button>
                            <Button color='error' onClick={() => setDeleteModal(true)}> <DeleteIcon/> </Button>
                        </div>
                    </div>
                ))}
            </div>

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add New Project State</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => setAddModal(false)}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => setAddModal(false)}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { editModal && 
                <form className="Modal" onSubmit={handleUpdate}>
                    <h1>Edit Project State</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => setAddModal(false)}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => setEditModal(false)}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { deleteModal && 
                <form className="Modal">
                    <h1>Delete this Project State?</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => setAddModal(false)}>close</Button>
                        </>
                    ):(
                        <>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" onClick={handleDelete} disabled={loading}>{loading ? (<CircularProgress/>):(<>Delete</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => setDeleteModal(false)}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>
    )
}

export default ProjectStates;