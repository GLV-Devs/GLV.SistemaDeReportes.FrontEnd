import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {

    const navigate = useNavigate()

    return(
        <div className="ErrorPage">
            <h1>Ha ocurrido un error</h1>
            <h3>La Seccion a la que intentas acceder no existe o existen errores.</h3>
            <Button variant="contained" onClick={() => navigate('/login')}>Volver</Button>
        </div>
    )
}

export default ErrorPage;