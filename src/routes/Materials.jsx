import { Outlet } from "react-router-dom";
import { Button } from "@mui/material";

const Materials = () => {
    return(
        <div className="Materials">
            <div className="MaterialsNavBar">
                <Button variant="contained">Agregar producto</Button>
                <Button variant="contained">editar producto</Button>
                <Button variant="contained">lista de productos</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Materials;