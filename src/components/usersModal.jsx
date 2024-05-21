import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from "@mui/material"
import axios from "axios"
import { accessToken, apiAddress } from "../globalResources"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { hash } from "../encrypt"

export const AddUser = ({close, info}) => {

    const navigate = useNavigate()
    // console.log(info)

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const [samePass, setSamePass] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        let phone
        if(samePass == false){phone = info.phoneNumber}else{phone = e.target[9].value}
        const data = { 
            personId: info.id,
            personInfo: {
                names: info.names,
                lastNames: info.lastNames,
                dateOfbirth: info.dateOfbirth,
                identificationtypeId: info.identificationTypeId,
                identificationNumber: info.identificationNumber,
                driverLicensePhotoId: info.driverLicensePhotoId,
                passportPhotoId: info.passportPhotoId,
                phoneNumber: info.phoneNumber,
            },
            userName: e.target[0].value,
            email: e.target[2].value,
            password: e.target[4].value,
            phoneNumber: phone,
        }
        console.log(data)
        axios.post(`${apiAddress}/api/account`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setLoading(false)
            setSuccess(true)
        }).catch((err) => {
            console.log(err.response)
            setError(true)
            setLoading(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            <h1>Add new user</h1>
            { success ? (
                <>
                    <h1>The user has been created</h1>
                    <Button variant='contained' color='error' onClick={close}>Close</Button>
                </>
            ):(
                <>
                    <TextField label='Username' className='fields' disabled={loading}/>
                    <TextField type='email' label='Email' className='fields' disabled={loading}/>
                    <TextField label='Password' type='Password' onChange={(e) => setPass1(e.target.value)} className='fields' disabled={loading}/>
                    <TextField label='Repeat password' type='Password' onChange={(e) => setPass2(e.target.value)} className='fields' disabled={loading}/>
                    <FormControlLabel className="fields" 
                        control={<Checkbox onChange={(e) => setSamePass(!e.target.checked)} disabled={loading}/>}
                        label='Use the same phone number'
                    />
                    { samePass && <TextField label='Phone number' className='fields'/> }
                    { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
                    { pass1 != '' && pass1 != pass2 && <h3 style={{color: 'red'}}>The passwords are not the same</h3> }
                    <div className="Buttons">
                        <Button variant='contained' type='submit' disabled={pass1 != pass2 || pass1 == '' || pass2 == '' || loading}>save</Button>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>Cancel</Button>
                    </div>
                </>
            ) }
        </form>
    )
}

export const EditUser = ({close, info}) => {

    const navigate = useNavigate()
    useEffect(() => {
        function getAccountInfo(){
            axios.get(`${apiAddress}/api/account/${info.id}`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((response) => {
                console.log(response.data.data[0])
                setUserInfo(response.data.data[0])
            }).catch((err) => {
                console.log(err.response)
                if(err.response.status == 401){
                    navigate('/Login')
                }
            })
        }

        getAccountInfo()
    }, [])

    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { 
            userName: e.target[0].value,
            email: e.target[2].value,
            phoneNumber: e.target[4],
        }
        axios.get(`${apiAddress}/api/account/${info.id}`, data, {Headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err.response)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            { success ? (
                <>
                    <h1>The user has been edited</h1>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </>
            ):(
                <>
                    <h1>Edit this user?</h1>
                    <TextField label='username' disabled={loading} defaultValue={userInfo.userName}/>
                    <TextField label='email' disabled={loading} defaultValue={userInfo.userEmail}/>
                    <TextField label='Phone' disabled={loading}/>
                    <div className="Buttons">
                        <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                        <Button variant='contained' type='submit'>save</Button>
                    </div>
                </>
            ) }
        </form>
    )
}

export const DeleteUser = ({close, info}) => {

    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [ready, setReady] = useState(false)
    const [count, setCount] = useState(20)
    const [deleteKey, setDeleteKey] = useState('')

    useEffect(() => {
        getDeleteKey()
    }, [])

    useEffect(() => {
        const decrease = setInterval(() => {
            if(count > 0){
                setCount(count -1)
            }else if(count == 0){
                setReady(true)
            }
        }, 1000)
        return () => clearInterval(decrease)
    }, [count])

    async function getDeleteKey(){
        try{
            const response = await axios.delete(`${apiAddress}/api/account/${info.id}`, {headers: {'Authorization': `Session ${accessToken}`}})
            setDeleteKey(response.data.data[0])
            console.log(response.data.data[0])            
        }catch(err){
            console.log(err)
        }

    }

    async function handleDelete(e){
        e.preventDefault()
        setDeleting(true)
        axios.delete(`${apiAddress}/api/account/?token=${deleteKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            if(response.status == 200){
                setDeleting(false)
                setError(false)
                setReady(false)
                setSuccess(true)
            }
        }).catch((err) => {
            setError(true)
            setDeleting(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
            console.log(err.response)
        })
    }

    return(
        <form className="Modal" onSubmit={handleDelete}>
            { success ? (
                <>
                    <h1>The user has been deleted</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </>
            ):(
                <>
                    <h1>Delete this user?</h1>
                    <div className="Buttons">
                        <Button variant='contained' type='submit' disabled={deleting || !ready}>
                            {deleting ? (<CircularProgress size={24}/>):(<>Delete {count}</>)}
                        </Button>
                        <Button variant='contained' color='error' onClick={close} disabled={deleting}>Cancel</Button>
                    </div>     
                    { error && <h3 style={{'color': 'red'}}>An error has ocurred</h3> }
                </>
            ) }
        </form>
    )
}

export const ChangePassword = ({close, info}) => {

    const navigate = useNavigate()

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        const data = {
            oldPasswordSHA256: await hash(e.target[0].value),
            newPassword: e.target[2].value
        }
        axios.put(`${apiAddress}/api/account/password`, data, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            console.log(response)
            setSuccess(true)
            setLoading(false)
        }).catch((err) => {
            console.log(err.response)
            setError(true)
            setLoading(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <form className='Modal' onSubmit={handleSubmit}>
            { success ? (
                <>
                    <h1>The password has been changed</h1>
                    <Button variant='contained' color='red' onClick={()=>close}>close</Button>
                </>
            ):(
                <>
                    <h1>Change User Password</h1>
                    <TextField label='Old password' disabled={loading}/>
                    <TextField label='New password' onChange={(e) => {setPass1(e.target.value)}} disabled={loading}/>
                    <TextField label='Repeat new password' onChange={(e) => {setPass2(e.target.value)}} disabled={loading}/>
                    { pass1 != '' && pass1 != pass2 && <h3 style={{color: 'red'}}>The passwords are not the same</h3> }
                    { error && <h3 style={{color: 'red'}}>An error has ocurred</h3> }
                    <div className='Buttons'>
                        <Button variant='contained' type='submit' disabled={pass1 != pass2 || pass1 == '' || pass2 == '' || loading}>save</Button>
                        <Button variant='contained' color='error' onClick={close} disabled={loading}>cancel</Button>
                    </div>
                </>
            ) }
        </form>
    )
}