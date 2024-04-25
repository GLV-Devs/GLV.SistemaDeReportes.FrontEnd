import { ModalAdd, ModalEdit, ModalView } from '../components/ModalMaterials'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Tooltip} from "@mui/material";
import { useState } from 'react';
import { faker } from '@faker-js/faker'

const Materials = () => {

    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')

    const infoPrueba = [{
        name: faker.commerce.productMaterial(),
        unit: 'Mts.'
    },{
        name: faker.commerce.productMaterial(),
        unit: 'Grs.'
    },{
        name: faker.commerce.productMaterial(),
        unit: 'Unids.'
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
            <h1>Materials list</h1>
            <Button variant='contained' onClick={openAddModal}>Add material</Button>
            {infoPrueba.map((item) => (
                <div className="LI">
                    <h3>{item.name}</h3>
                    <div className="Buttons">
                        <Tooltip title='Edit'>
                            <Button variant="text" onClick={() => openEditModal()}> <ModeEditIcon/> </Button>
                        </Tooltip>
                        <Tooltip title='Delete'>
                            <Button onClick={() => openViewModal(item)}> <VisibilityIcon/> </Button>
                        </Tooltip>
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