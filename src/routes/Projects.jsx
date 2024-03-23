import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Projects = () => {

    const infoPrueba = [{
        name: 'Casa',
        address: 'Av Bella vista',
        idType: 'casa',
        idNumber: '1',
        phone: '0412',
    },{
        name: 'Edificio',
        address: 'Av Universidad',
        idType: 'edificio',
        idNumber: '2',
        phone: '0414',
    }]

    return(
        <div className="Projects">
            <h1>Listado de Proyectos</h1>
            <Button variant="contained">Agregar proyecto</Button>
            { infoPrueba.map((project) => (
                <div className='LI'>
                    <div className='info'>
                        <h3>{project.name}</h3>
                        <h3>{project.idType}-{project.idNumber}</h3>
                    </div>

                    <div className="Buttons">
                        <Button variant='contained'>editar</Button>
                        <Button variant='contained'>ver info</Button>
                    </div>
                </div>
            )) }
        </div>
    )
}

export default Projects;