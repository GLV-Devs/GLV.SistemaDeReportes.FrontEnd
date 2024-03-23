import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NavBar = () => {

    const navigate = useNavigate()

    return(
        <div className="NavBar">
            <h3>Sistema de Control</h3>
            <Button variant="contained" onClick={() => navigate('/main/personas')}>Personas</Button>
            <Button variant="contained" onClick={() => navigate('/main/proyectos')}>Proyectos</Button>
            <Button variant="contained" onClick={() => navigate('/main/productos')}>Productos</Button>
            <div className="sesion">
                <h3>Bienvenido, Jesus Lozano</h3>
                <Button variant="contained" color='error'>Salir</Button>
            </div>
        </div>
    )
}

export default NavBar;