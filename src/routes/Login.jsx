import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Login = () => {

    const { setUserData } = useContext(AppContext)
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            identifier: e.target[0].value,
            passwordSHA256: e.target[2].value,
        }
        try{
            axios.put('https://c2hpskzr-7239.use2.devtunnels.ms/swagger/api/identity', data)
            .then((response) => {
                console.log(response)
                setUserData(response)
                navigate('/main')
            })
        } catch(err){
            setError(true)
        }
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