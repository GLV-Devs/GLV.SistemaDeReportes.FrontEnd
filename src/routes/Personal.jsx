import {ModalAdd, ModalEdit, ModalView} from '../components/ModalPersonal'
import { Button, Modal } from "@mui/material";
import { useState } from "react";

const Personal = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

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
            <h1>Lista del personal</h1>
            <Button variant='contained' onClick={openAddModal}>Agregar Personal</Button>
            {infoPrueba.map( (worker) => (
                <div className="LI">
                    <div className="info">
                        <h4>{worker.name}</h4>
                        <h4>{worker.idType} {worker.idNumber}</h4>
                    </div>
                    <div className="Buttons">
                        <Button variant='contained' onClick={ () => openEditModal() }>Editar</Button>
                        <Button variant="contained" onClick={() => openViewModal(worker)}>Ver info</Button>
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