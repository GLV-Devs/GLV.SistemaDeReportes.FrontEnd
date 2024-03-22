import { Outlet } from "react-router-dom";
import { Button } from "@mui/material";

const Personal = () => {
    return(
        <div className="Personal">
            <div className="PersonalNavBar">
                <Button variant="contained">Agregar persona</Button>
                <Button variant="contained">editar persona</Button>
                <Button variant="contained">lista de personas</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default Personal;