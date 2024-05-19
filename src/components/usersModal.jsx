import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material"
import axios from "axios"
import { accessToken, apiAddress } from "../globalResources"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
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
    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { 
            userName: e.target[0].value,
            email: e.target[2].value,
            permissions: {
                value: 0,
            },
            names: info.names,
            lastNames: info.lastNames,
            dateOfBirth: {
                value: info.dateOfBirth,
            },
            identificationTypeId: {
                value: info.identificationtypeId,
            },
            identificationNumber: {
                value: info.identificationNumber
            },
            driverLicensePhotoId: {
                value: info.driverLicensePhotoId,
            },
            passportPhotoId: {
                value: info.passportPhotoId,
            },
            phoneNumber: info.phoneNumber,
            managedProjects: null
        }
        axios.get(`${apiAddress}/api/`, data, {Headers: {'Authorization': `Session ${accessToken}`}})
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
            <h1>Edit this user?</h1>
            <div className="Buttons">
                <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                <Button variant='contained' type='submit'>save</Button>
            </div>
        </form>
    )
}

export const DeleteUser = ({close, info}) => {

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { 

        }
        axios.get(`${apiAddress}/api/`, data, {Headers: {'Authorization': `Session ${accessToken}`}})
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
            <h1>Delete this user?</h1>
            <div className="Buttons">
                <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                <Button variant='contained' type='submit'>delete</Button>    
            </div>
        </form>
    )
}

export const ChangePassword = ({close, info}) => {

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const {success, setSuccess} = useState(false)

    function handleSubmit(){
        e.preventDefault()
        const data = {
            oldPasswordSHA256: hash(e.target[0].value),
            newPassword: e.target[2].value
        }
        console.log(data)
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
                    <TextField label='Old password'/>
                    <TextField label='New password' onChange={(e) => {setPass1(e.target.value)}}/>
                    <TextField label='Repeat new password' onChange={(e) => {setPass2(e.target.value)}}/>
                    { pass1 != '' && pass1 != pass2 && <h3 style={{color: 'red'}}>The passwords are not the same</h3> }
                    <div className='Buttons'>
                        <Button variant='contained' type='submit' disabled={pass1 != pass2 || pass1 == '' || pass2 == '' || loading}>save</Button>
                        <Button variant='contained' color='error' onClick={()=>close}>cancel</Button>
                    </div>
                </>
            ) }
        </form>
    )
}