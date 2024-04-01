import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NavBar = () => {

    const navigate = useNavigate()

    return(
        <div className="NavBar">
            <h4>Control System - Jesus Lozano</h4>

            <div className="Buttons">
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/personas')}>Staff</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/proyectos')}>projects</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/productos')}>Materials</Button>
                <Button size='small' variant="text" color='error'>Log out</Button>
            </div>
        </div>
    )
}

export default NavBar;