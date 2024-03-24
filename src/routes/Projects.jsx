import { ModalAdd, ModalEdit, ModalView } from "../components/ModalProjects";
import { Button } from "@mui/material";
import { useState } from "react";

const Projects = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

    const infoPrueba = [{
        name: 'Casa',
        address: 'Av Bella vista',
        idType: 'casa',
        idNumber: '1',
        phone: '0412',
        status: 'Activado',
    },{
        name: 'Edificio',
        address: 'Av Universidad',
        idType: 'edificio',
        idNumber: '2',
        phone: '0414',
        status: 'En Proceso',
    }]

    function openViewModal(data){
        setView(!view)
        setSelected(data)
    }

    function openAddModal(){
        setAdd(!add)
    }

    function openEditModal(){
        setEdit(!edit)
    }

    return(
        <div className="Projects">
            <h1>Listado de Proyectos</h1>
            <Button variant="contained" onClick={openAddModal}>Agregar proyecto</Button>
            { infoPrueba.map((project) => (
                <div key={project.name} className='LI'>
                    <div className='info'>
                        <h3>{project.name}</h3>
                        <h3>{project.idType}-{project.idNumber}</h3>
                    </div>

                    <div className="Buttons">
                        <Button variant='contained' onClick={ () => openEditModal() }>editar</Button>
                        <Button variant='contained' onClick={ () => openViewModal(project) }>ver info</Button>
                    </div>
                </div>
            )) }

            { edit && <ModalEdit  close={openEditModal}/> }
            { add &&  <ModalAdd close={openAddModal}/>}
            { view && <ModalView info={selected} close={openViewModal}/> }
        </div>
    )
}

export default Projects;