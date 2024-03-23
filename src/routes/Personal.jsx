import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Personal = () => {

    const navigate = useNavigate()

    const infoPrueba = [{
        name: 'Jesus Lozano',
        address: 'Av Uni',
        idType: "V",
        idNumber: '28.288.269',
        phone: '0412-7859759',
    },{
        name: 'Diego Garcia',
        address: 'Bella Vista',
        idType: "E",
        idNumber: '0.000.001',
        phone: '0414',
    }]

    return(
        <div className="Personal">
            <h1>Lista del personal</h1>
            <Button variant='contained'>Agregar Personal</Button>
            {infoPrueba.map( (worker) => (
                <div className="LI">
                    <div className="info">
                        <h4>{worker.name}</h4>
                        <h4>{worker.idType} {worker.idNumber}</h4>
                    </div>
                    <div className="Buttons">
                        <Button variant='contained'>Editar</Button>
                        <Button variant="contained">Ver info</Button>
                    </div>
                </div>
            ) )}
        </div>
    )
}

export default Personal;