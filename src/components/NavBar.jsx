import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import axios from "axios";

const NavBar = () => {

    const { setUserData } = useContext(AppContext)
    const navigate = useNavigate()

    async function logOut(){
        setUserData('')
        axios.delete('https://c2hpskzr-7239.use2.devtunnels.ms/swagger/api/identity')
        .then(
            navigate('/login')
        )
    }

    return(
        <div className="NavBar">
            <h4>Control System - Jesus Lozano</h4>

            <div className="Buttons">
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/personas')}>Staff</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/proyectos')}>projects</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/productos')}>Materials</Button>
                <Button size='small' variant="text" color='error' onClick={logOut}>Log out</Button>
            </div>
        </div>
    )
}

export default NavBar;