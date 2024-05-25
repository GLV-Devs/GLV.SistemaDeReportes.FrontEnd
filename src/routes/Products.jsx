import { Button, TextField, CircularProgress, Tooltip } from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useState, useEffect, useContext } from "react";
import { apiAddress, accessToken } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../functions";

const Products = () => {

    const {productList, setProductList} = useContext(AppContext)
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
    const [showList, setShowList] = useState(productList)

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            unit: e.target[2].value,
        }
        axios.post(`${apiAddress}/api/product`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
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
        axios.delete(`${apiAddress}/api/product/${selectedItem}`, {headers: {'Authorization': `Session ${accessToken}`}})
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
        let unit
        if(e.target[0].value == ''){
            name = null
        }else{ name = e.target[0].value }
        if(e.target[2].value == ''){
            unit = null
        }else{ unit = e.target[2].value }
        const data = {
            name: name,
            unit: unit,
        }
        console.log(data)
        axios.put(`${apiAddress}/api/product/${selectedItem.id}`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
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

    async function getList(){
        setListError(false)
        setListLoadin(true)
        axios.get(`${apiAddress}/api/product`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            if(response.status == 200){
                setListLoadin(false)
                setListError(false)
                if(response.data.data == null){
                    setProductList([{name: '', id: ""}])
                    setShowList([{name: '', id: ""}])
                }else{
                    setProductList(response.data.data)
                    setShowList(response.data.data)
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

    const handleSearch = (e) => {
        const results = []
        if (e.target.value == ''){
            setShowList(productList)
        }else{
            productList.forEach(item => {
                if(item.name.includes(e.target.value)){
                    results.push(item)
                }else if(item.name.includes(capitalize(e.target.value))){
                    results.push(item)
                }
            })
            setShowList(results)
        }
    }

    return(
        <div className='Products'>
            <h1>Products</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new product</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
                <>
                    <TextField label='Search' onChange={handleSearch}/>
                    <table>
                        <th>Name</th>
                        <th>Unit.</th>
                        <th>Options</th>
                        {showList.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td className='options'>
                                    <Tooltip title='Edit'>
                                        <Button onClick={() => {setEditModal(true); setSelectedItem(item)}}> <ModeEditIcon/> </Button>
                                    </Tooltip>
                                    <Tooltip title='Delete'>
                                        <Button color='error' onClick={() => {setSelectedItem(item.id); setDeleteModal(true)}}> <DeleteIcon/> </Button>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </table>
                </>
            }

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add New Product</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setAddModal(false); setSuccess(false); setLoading(false);getList()}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            <TextField label='Unit' disabled={loading}/>
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
                    <h1>Edit Product</h1>
                    {success ? (
                        <>
                            <h1>Edited Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => {setEditModal(false); setSuccess(false); getList(); setSelectedItem(0); setLoading(false)}}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading} defaultValue={selectedItem.name}/>
                            <TextField label='Unit' disabled={loading} defaultValue={selectedItem.unit}/>
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
                    <h1>Delete Product</h1>
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
                                <Button variant="contained" color='error' disabled={loading} onClick={() => {setDeleteModal(false); setSelectedItem(0)}}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>
    )
}

export default Products;