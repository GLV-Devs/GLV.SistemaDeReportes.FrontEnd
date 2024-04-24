import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { apiAddress } from '../globalResources'
import { hash } from '../encrypt'

const Login = () => {

    // async function trys(){
    //     axios.
    // }

    // useEffect(() => {

    // })

    const { setUserData } = useContext(AppContext)
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            identifier: e.target[0].value,
            passwordSHA256: await hash(e.target[2].value),
        }
        console.log(data)
        axios.put(`${apiAddress}/api/identity`, data)
        .then((response) => {
            console.log(response)
            setUserData(response)
            navigate('/main')
        })

    }
    return(
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <TextField type="text" label='Username'/>
                <TextField type="password" label='Password'/>
                { error && <h3>Algo salio mal</h3> }
                <Button variant="contained" type="submit">Login</Button>
            </form>
        </div>
    )
}

export default Login