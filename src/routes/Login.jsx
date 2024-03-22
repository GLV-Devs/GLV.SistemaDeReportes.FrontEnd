import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            username: e.target[0].value,
            password: e.target[2].value,
        }
        console.log(data)
        navigate('/main');
    }

    return(
        <form className="Login" onSubmit={handleSubmit}>
            <h1>Iniciar Sesion</h1>
            <TextField type="text" label='Username'/>
            <TextField type="password" label='Contraseña'/>
            <Button variant="contained" type="submit">Iniciar sesion</Button>
        </form>
    )
}

export default Login;