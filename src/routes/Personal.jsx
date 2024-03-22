import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Personal = () => {

    const navigate = useNavigate()

    return(
        <div className="Personal">
            <div className="PersonalNavBar">
                <Button variant="contained" onClick={() => navigate('/main/personas/agregar')}>Agregar persona</Button>
                <Button variant="contained" onClick={() => navigate('/main/personas/editar')}>editar persona</Button>
                <Button variant="contained" onClick={() => navigate('/main/personas/lista')}>lista de personas</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Personal;