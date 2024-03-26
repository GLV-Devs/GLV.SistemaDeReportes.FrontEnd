import {ModalAdd, ModalEdit, ModalView} from '../components/ModalPersonal'
import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { faker } from '@faker-js/faker'

const Personal = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

    const infoPrueba = [{
        name: faker.person.fullName(),
        address: faker.location.secondaryAddress(),
        idType: "V",
        idNumber: faker.number.int({max: 99999999}),
        phone: faker.phone.number(),
    },{
        name: faker.person.fullName(),
        address: faker.location.secondaryAddress(),
        idType: "E",
        idNumber: faker.number.int({max: 99999999}),
        phone: faker.phone.number(),
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
        <div className="Personal">
            <h1>Staff list</h1>
            <Button variant='contained' onClick={openAddModal}>Add Staff</Button>
            {infoPrueba.map( (worker) => (
                <div className="LI">
                    <div className="info">
                        <h4>{worker.name}</h4>
                        <h4>{worker.idType} {worker.idNumber}</h4>
                    </div>
                    <div className="Buttons">
                        <Button variant='contained' onClick={ () => openEditModal() }>Edit</Button>
                        <Button variant="contained" onClick={() => openViewModal(worker)}>See info</Button>
                    </div>
                </div>
            ) )}

            { edit && <ModalEdit  close={openEditModal}/> }
            { add &&  <ModalAdd close={openAddModal}/>}
            { view && <ModalView info={selected} close={openViewModal}/> }
        </div>
    )
}

export default Personal;