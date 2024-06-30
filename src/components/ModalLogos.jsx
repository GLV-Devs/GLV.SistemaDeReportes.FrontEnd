import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { apiAddress, accessToken } from '../globalResources'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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