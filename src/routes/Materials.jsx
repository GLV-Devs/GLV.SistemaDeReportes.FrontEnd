import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Materials = () => {

    const infoPrueba = [{
        name: 'Cable inalambrico'
    },{
        name: 'Soldadura en polvo'
    },{
        name: 'Tuercas para tornillos'
    }]

    return(
        <div className="Materials">
            <h1>Listado de materiales</h1>
            <Button variant='contained'>Agregar material</Button>
            {infoPrueba.map((item) => (
                <div className="LI">
                    <h3>{item.name}</h3>
                    <div className="Buttons">
                        <Button variant="contained">Editar</Button>
                        <Button variant="contained">Ver info</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Materials;