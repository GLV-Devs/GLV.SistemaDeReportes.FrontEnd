import { TextField, Button } from "@mui/material"
import axios from "axios"
import { accessToken, apiAddress } from "../globalResources"
import { useNavigate } from "react-router-dom"


export const AddUser = ({close, projectInfo}) => {

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
            <h1>Add new user</h1>
            <div className="Buttons">
                <Button variant='contained' type='submit'>save</Button>
                <Button variant='contained' color='error' onClick={() => close}>Cancel</Button>
            </div>
        </form>
    )
}

export const EditUser = ({close, projectInfo}) => {

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
            <h1>Edit this user?</h1>
            <div className="Buttons">
                <Button variant='contained' color='error' onClick={() => close}>Cancel</Button>
                <Button variant='contained' type='submit'>save</Button>
            </div>
        </form>
    )
}

export const DeleteUser = ({close, projectInfo}) => {

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
                <Button variant='contained' color='error' onClick={() => close}>Cancel</Button>
                <Button variant='contained' type='submit'>delete</Button>    
            </div>
        </form>
    )
}