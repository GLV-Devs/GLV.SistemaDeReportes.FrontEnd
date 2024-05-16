import { TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { apiAddress, ChangeApiAddress, setAccessToken } from '../globalResources'
import { hash } from '../encrypt'

const Login = () => {

    const { setUserInfo } = useContext(AppContext)
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showAddress, setShowAddress] = useState(apiAddress)
    const [errorList, setErrorList] = useState(false)
    const [errorName, setErrorName] = useState('')

    async function handleSubmit(e){
        e.preventDefault();
        setErrorList(false)
        setError(false)
        setLoading(true)
        const data = {
            identifier: e.target[0].value,
            passwordSHA256: await hash(e.target[2].value),
        }
        // console.log(data)
        axios.put(`${apiAddress}/api/identity`, data)
        .then((response) => {
            if(response.status == 200){
                setAccessToken(response.data.data[0].key)
            }
            // console.log(response)
            axios.get(`${apiAddress}/api/account`, {headers: {'Authorization': `Session ${response.data.data[0].key}`}})
            .then((subResponse) => {
                if(response.status){
                    setUserInfo(subResponse.data.data[0])
                    navigate('/main')
                }
            }).catch((err) => {
                setLoading(false)
                setError(true)
            })
        }).catch((err) => {
            if(err){
                if(err.response.data.dataType == 'ErrorList'){
                    setErrorList(true)
                    setErrorName(err.response.data.data[0].defaultMessageES)
                }
                console.log(err.response)
                setLoading(false)
                setError(true)
            }
        })
    }

    const change = (e) => {
        e.preventDefault()
        ChangeApiAddress(e.target[0].value)
        setShowAddress(apiAddress)
    }
    return(
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <TextField disabled={loading} type="text" label='Username'/>
                <TextField disabled={loading} type="password" label='Password'/>
                { error && <h3 style={{color: 'red', margin: '0px'}}>An error has occurred</h3> }
                { errorList && <h3 style={{color: 'red', margin: '0px'}}>{errorName}</h3> }
                <Button disabled={loading} variant="contained" type="submit">{ loading ? (<CircularProgress size={24}/>):(<>Login</>) }</Button>
            </form>

            {/* Debug Tool */}
            {/* <form onSubmit={change}>
                <p>Current address: {showAddress}</p>
                <TextField label='Backend address'/>
                <Button type="submit">Change</Button>
            </form> */}
            {/* Debug Tool */}
        </div>
    )
}

export default Login