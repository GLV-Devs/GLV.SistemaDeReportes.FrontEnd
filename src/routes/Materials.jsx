import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Materials = () => {

    const navigate = useNavigate()

    return(
        <div className="Materials">
            <div className="MaterialsNavBar">
                <Button variant="contained" onClick={() => navigate('/main/productos/agregar')}>Agregar producto</Button>
                <Button variant="contained" onClick={() => navigate('/main/productos/editar')}>editar producto</Button>
                <Button variant="contained" onClick={() => navigate('/main/productos/lista')}>lista de productos</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Materials;