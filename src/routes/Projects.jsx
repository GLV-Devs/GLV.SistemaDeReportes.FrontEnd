import { Outlet } from "react-router-dom";
import { Button } from "@mui/material";

const Projects = () => {
    return(
        <div className="Projects">
            <div className="ProjectsNavBar">
                <Button variant="contained">Agregar proyecto</Button>
                <Button variant="contained">editar proyecto</Button>
                <Button variant="contained">lista de proyectos</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Projects;