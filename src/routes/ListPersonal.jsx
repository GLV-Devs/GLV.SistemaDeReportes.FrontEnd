import { TextField, Button } from "@mui/material";

const ListPersonal = () => {

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
        idNumber: '27...',
        phone: '0414',
    }]

    return(
        <div className="AddPersonal">
            <h1>Lista del personal</h1>
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

export default ListPersonal;