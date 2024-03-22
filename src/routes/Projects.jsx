import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Projects = () => {

    const navigate = useNavigate()

    return(
        <div className="Projects">
            <div className="ProjectsNavBar">
                <Button variant="contained" onClick={() => navigate('/main/proyectos/agregar')}>Agregar proyecto</Button>
                <Button variant="contained" onClick={() => navigate('/main/proyectos/editar')}>editar proyecto</Button>
                <Button variant="contained" onClick={() => navigate('/main/proyectos/lista')}>lista de proyectos</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Projects;