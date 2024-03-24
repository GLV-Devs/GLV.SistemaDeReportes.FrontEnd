import { ModalAdd, ModalEdit, ModalView } from '../components/modalMaterials'
import { Button } from "@mui/material";
import { useState } from 'react';

const Materials = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

    const infoPrueba = [{
        name: 'Cable inalambrico'
    },{
        name: 'Soldadura en polvo'
    },{
        name: 'Tuercas para tornillos'
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
        <div className="Materials">
            <h1>Listado de materiales</h1>
            <Button variant='contained' onClick={openAddModal}>Agregar material</Button>
            {infoPrueba.map((item) => (
                <div className="LI">
                    <h3>{item.name}</h3>
                    <div className="Buttons">
                        <Button variant="contained" onClick={() => openEditModal()}>Editar</Button>
                        <Button variant="contained" onClick={() => openViewModal(item)}>Ver info</Button>
                    </div>
                </div>
            ))}

            { edit && <ModalEdit  close={openEditModal}/> }
            { add &&  <ModalAdd close={openAddModal}/>}
            { view && <ModalView info={selected} close={openViewModal}/> }
        </div>
    )
}

export default Materials;