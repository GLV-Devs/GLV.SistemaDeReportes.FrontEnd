import { TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { apiAddress } from '../globalResources'
import { hash } from '../encrypt'

const Login = () => {

    const { setAccessToken, setUserInfo } = useContext(AppContext)
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault();
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
                setLoading(false)
                setError(true)
            }
        })

    }
    return(
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <TextField disabled={loading} type="text" label='Username'/>
                <TextField disabled={loading} type="password" label='Password'/>
                { error && <h3 style={{color: 'red', margin: '0px'}}>An error has occurred</h3> }
                <Button disabled={loading} variant="contained" type="submit">{ loading ? (<CircularProgress/>):(<>Login</>) }</Button>
            </form>
        </div>
    )
}

export default Login