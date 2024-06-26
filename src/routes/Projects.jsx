import { ModalAdd, ModalEdit, ModalView } from "../components/ModalProjects";
import { Button } from "@mui/material";
import { useState } from "react";
import { faker } from '@faker-js/faker'

const Projects = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

    const infoPrueba = [{
        name: faker.commerce.product(),
        status: 'Activado',
    },{
        name: faker.commerce.product(),
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
            <h1>Project List</h1>
            <Button variant="contained" onClick={openAddModal}>Add Project</Button>
            { infoPrueba.map((project) => (
                <div key={project.name} className='LI'>
                    <div className='info'>
                        <h3>{project.name}</h3>
                    </div>

                    <div className="Buttons">
                        <Button variant='contained' onClick={ () => openEditModal() }>edit</Button>
                        <Button variant='contained' onClick={ () => openViewModal(project) }>see info</Button>
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