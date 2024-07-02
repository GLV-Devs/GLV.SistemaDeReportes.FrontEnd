import { useState, useContext, useEffect } from 'react'
import { Button, CircularProgress, Tooltip } from '@mui/material'
import { apiAddress, accessToken } from '../globalResources'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppContext } from "../context/AppContext";

export const AddLogo = ({close, update}) => {

    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const file = document.getElementById('fileInput')
        axios.post(`${apiAddress}/data/logos`, file.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image'}})
        .then((res) => {
            console.log(res)
            setSuccess(true)
        }).catch((err) => {
            setError(true)
            console.log(err.response)
            if(err.response.status == 401){
                navigate('/Login')
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            { success ? (
                <>
                    <h1>New logo uploaded</h1>
                    <Button variant='contained' color='error' onClick={update}>close</Button>
                </>
            ):(
                <>
                    <h1>Upload new logo</h1>
                    <input type='file' disabled={loading} id='fileInput'/>
                    { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
                    <div className='Buttons'>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>close</Button>
                        <Button variant='contained' type='submit' disabled={loading}>{loading ? (<CircularProgress size={24}/>):(<>save</>)}</Button>
                    </div>
                </>
            ) }
        </form>
    )
}

export const AssignLogo = ({close, selection}) => {

    useEffect(() => {getList()}, [])
    const navigate = useNavigate()
    const {logoKeys, setLogoKeys} = useContext(AppContext)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [listLoading, setListLoading] = useState(true)

    function getList(){
        if(logoKeys != []){
            axios.get(`${apiAddress}/data/logos`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((res) => {
                setLogoKeys(res.data.data)
                console.log(res)
            }).catch((err) => {
                console.log(err.response)
                if(err.response.status == 401){
                    navigate('/Login')
                }
            }).finally(() => {
                setListLoading(false)
            })
        }else{
            setListLoading(false)
        }
    }

    return(
        <div className='Modal ModalSelectLogo'>
            { success ? (
                <>
                    <h1>Logo selected</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </>
            ):(
                <>
                    <h1>Select a logo for this project</h1>
                    { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }

                    {listLoading ? (
                        <CircularProgress/>
                    ):(
                        <div className="logoListBox">
                            { logoKeys.map((item) => (
                                <div className="logoBox">
                                    <Tooltip title='Select this logo'>
                                        <img src={`${apiAddress}/data/logos/${item.key}`} onClick={() => {setSuccess(true); selection(item.key)}}/>
                                    </Tooltip>
                                </div>
                            )) }
                        </div>
                    )}

                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </>
            ) }
        </div>
    )
}