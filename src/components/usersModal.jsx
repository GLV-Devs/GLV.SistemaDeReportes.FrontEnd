import { TextField, Button } from "@mui/material"
import axios from "axios"
import { accessToken, apiAddress } from "../globalResources"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'


export const AddUser = ({close, info}) => {

    const navigate = useNavigate()
    console.log(info)

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
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
            phoneNumber: info.phoneNumber,
        }
        // console.log(data)
        // axios.get(`${apiAddress}/api/`, data, {Headers: {'Authorization': `Session ${accessToken}`}})
        // .then((response) => {
        //     console.log(response)
        // }).catch((err) => {
        //     console.log(err.response)
        //     if(err.response.status == 401){
        //         navigate('/Login')
        //     }
        // })
    }

    return(
        <form className="Modal" onSubmit={handleSubmit}>
            <h1>Add new user</h1>
            <TextField label='Username'/>
            <TextField type='email' label='Email'/>
            <TextField label='Password' type='Password' onChange={(e) => setPass1(e.target.value)}/>
            <TextField label='Repeat password' type='Password' onChange={(e) => setPass2(e.target.value)}/>
            <div className="Buttons">
                <Button variant='contained' type='submit' disabled={pass1 === pass2}>save</Button>
                <Button variant='contained' color='error' onClick={close}>Cancel</Button>
            </div>
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