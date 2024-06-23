import { Button, TextField, CircularProgress, Tooltip } from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useState, useEffect, useContext } from "react";
import { apiAddress, accessToken } from "../globalResources";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { message } from "antd";

const IdTypes = () => {

    const {idTypeList, setIdTypeList} = useContext(AppContext)
    const navigate = useNavigate()
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [listError, setListError] = useState(false)
    const [listLoading, setListLoadin] = useState(false)
    const [selectedItem, setSelectedItem] = useState(0)
    const [messageApi, contextHolder] = message.useMessage();

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            symbol: e.target[2].value,
            format: e.target[4].value,
        }
        axios.post(`${apiAddress}/api/identificationtype`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
            }else if (response.status == 401){
                navigate('/Login')
            }
        })
        .catch((err) => {
            setLoading(false)
            setError(true)
            console.log(err.response.data)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function handleDelete(){
        setError(false)
        setLoading(true)
        axios.delete(`${apiAddress}/api/identificationtype/${selectedItem}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status == 200){
            setSuccess(true)
            }
        })
        .catch((err) => {
            setLoading(false)
            setError(true)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
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
        let symbol
        let format
        if(e.target[0].value == ''){
            name = null
        }else{ name = e.target[0].value }
        if(e.target[2].value == ''){
            symbol = null
        }else{ symbol = e.target[2].value }
        if(e.target[4].value == ''){
            format = null
        }else{ format = e.target[4].value }
        const data = {
            name: name,
            symbol: symbol,
            format: format,
        }
        console.log(data)
        axios.put(`${apiAddress}/api/identificationtype/${selectedItem.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setSuccess(true)
            }
        })
        .catch((err) => {
            setLoading(false)
            setError(true)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    async function getList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/identificationtype`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status){
                setListLoadin(false)
                setListError(false)
                if(response.data.data == null){
                    setIdTypeList([{name: ''}])
                }else{
                    setIdTypeList(response.data.data)
                }
            }
        })
        .catch((err) => {
            setListError(true)
            setListLoadin(false)
            console.log(err)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <div className='IdTypes'>
            {contextHolder}
            <h1>ID Types Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new id Type</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
                <div>
                    {idTypeList.map((item) => (
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
                    <h1>Add New ID Type</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(false); setLoading(false); getList()}}>close</Button>
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

            { editModal && 
                <form className="Modal" onSubmit={handleUpdate}>
                    <h1>Edit ID Type</h1>
                    {success ? (
                        <>
                            <h1>Edited Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setEditModal(false); setSuccess(false); setSelectedItem(0); setLoading(false); getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading} defaultValue={selectedItem.name}/>
                            <TextField label='Symbol' disabled={loading} defaultValue={selectedItem.symbol}/>
                            <TextField label='Format' disabled={loading} defaultValue={selectedItem.format}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setEditModal(false); setSuccess(false); setSelectedItem(0)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }

            { deleteModal && 
                <form className="Modal">
                    <h1>Delete this ID Type?</h1>
                    {success ? (
                        <>
                            <h1>Deleted Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setDeleteModal(false); setSuccess(false); setSelectedItem(0); setLoading(false); getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" onClick={handleDelete} disabled={loading}>{loading ? (<CircularProgress/>):(<>Delete</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setDeleteModal(false); setSuccess(false); setSelectedItem(0); setLoading(false)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>
    )
}

export default IdTypes;