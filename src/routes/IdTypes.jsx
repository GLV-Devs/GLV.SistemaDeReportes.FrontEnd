import { Button, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { apiAddress } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const IdTypes = () => {

    useEffect(() => {getList()}, [])

    const navigate = useNavigate()
    const { userData } = useContext(AppContext)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [listError, setListError] = useState(false)
    const [listLoading, setListLoadin] = useState(true)
    const [list, setList] = useState('')

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            symbol: e.target[2].value,
            format: e.target[4].value,
        }
        axios.post(`${apiAddress}/api/identificationtype`, data, {headers: {'Authorization': `Bearer ${userData.data.accessToken}`}})
        .then((response) => {
            if(response.status == 200){
                setSuccess(true)
                setList(response.data)
            }else if (response.status == 401){
                navigate('/Login')
            }
        })
        .catch((err) => {
            if(err){
                setLoading(false)
                setError(true)
            }
        })
    }

    async function handleDelete(){
        setError(false)
        setLoading(true)
        axios.delete(`${apiAddress}/api/identificationtype`)
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
            symbol: e.target[2].value,
            format: e.target[4].value,
        }
        axios.put(`${apiAddress}/api/identificationtype`, data)
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

    async function getList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/identificationtype`, {headers: {'Authorization': `Bearer ${userData.data.accessToken}`}})
        .then((response) => {
            if(response.status == 200){
                setListLoadin(false)
                setListError(false)
                console.log(response)
            }
        })
        .catch((err) => {
            setListError(true)
            setListLoadin(false)
            console.log(err)
        })
    }

    return(
        <div className='IdTypes'>
            <h1>ID Types Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new id Type</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
                <div>
                    {list.map((item) => (
                        <div className='LI'>
                            <h3>{item.name}</h3>
                            <div>
                                <Tooltip title='Edit'>
                                    <Button onClick={() => setEditModal(true)}> <ModeEditIcon/> </Button>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <Button color='error' onClick={() => setDeleteModal(true)}> <DeleteIcon/> </Button>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            }

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add New ID Type</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(true)}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            <TextField label='Symbol' disabled={loading}/>
                            <TextField label='Format' disabled={loading}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setAddModal(false); setError(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Edit ID Type</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(true)}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            <TextField label='Symbol' disabled={loading}/>
                            <TextField label='Format' disabled={loading}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setAddModal(false); setError(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { deleteModal && 
                <form className="Modal">
                    <h1>Delete this ID Type?</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(false)}}>close</Button>
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

export default IdTypes;