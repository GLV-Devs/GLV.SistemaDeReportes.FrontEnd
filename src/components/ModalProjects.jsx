import { Button, TextField, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Fab, Tooltip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useState, useRef } from "react"
import { faker } from '@faker-js/faker'
import axios from "axios";
import { apiAddress } from '../globalResources'

export const ModalView = ({info, close}) => {

    const [addNote, setAddNote] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

    const infoPrueba = [{
        date: faker.date.past().toLocaleDateString(),
        cat: 'Fallas',
        user: faker.person.fullName(),
        line: faker.lorem.sentence(5),
    },{
        date: faker.date.past().toLocaleDateString(),
        cat: 'Birthday',
        user: faker.person.fullName(),
        line: faker.lorem.sentence(5),
    },{
        date: faker.date.past().toLocaleDateString(),
        cat: '2',
        user: faker.person.fullName(),
        line: faker.lorem.sentence(5),
    }]

    const usedMaterials = [{
        name: faker.commerce.product(),
        qtty: faker.number.int({max: 10}),
    },{
        name: faker.commerce.product(),
        qtty: faker.number.int({max: 10}),
    },{
        name: faker.commerce.product(),
        qtty: faker.number.int({max: 10}),
    }]

    return(
        <div className='ModalDual'>
            <div className='content'>
                <div className='left'>
                    <h1>Info</h1>
                    <h3>Name: {info.name}</h3>
                    <h3>Status: {info.status}</h3>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Staff</AccordionSummary>
                        <AccordionDetails>{faker.person.fullName()}, {faker.person.fullName()}</AccordionDetails>
                    </Accordion>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Users with access</AccordionSummary>
                        <AccordionDetails>{faker.person.fullName()}, {faker.person.fullName()}</AccordionDetails>
                    </Accordion>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Used Materials</AccordionSummary>
                        <AccordionDetails>{usedMaterials.map((material) => (<div>{material.qtty} {material.name}</div>))}</AccordionDetails>
                    </Accordion>
                    <Button variant='contained' color='error' onClick={() => setDeleteConfirmation(true)}>delete project</Button>
                </div>
                <div className="divider"></div>
                <div className='right'>
                    <h1>Reports</h1>
                            {infoPrueba.map((report) => (
                                <Accordion key={report.date} className="Accordion" variant="elevation">
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        {report.date}  -  {report.cat}  -  {report.user}  -  {report.line}
                                    </AccordionSummary>
                                    <AccordionDetails>{report.user} {faker.lorem.sentence(15)}</AccordionDetails>
                                </Accordion>
                            ))}
                </div>
            </div>
            
            <div className="Buttons">
                <Button variant='contained' onClick={() => setAddNote(true)}>Add report</Button>
                <Button variant="contained" color='error' onClick={close}>Close</Button>
            </div>

            { addNote && <AddReportModal close={ () => setAddNote(false) }/> }
            { deleteConfirmation && <deleteModal close={ () => setAddNote(false) } projectKey={projectKey}/> }
        </div>
    )
}

export const ModalEdit = ({close, projectKey}) => {

    const [success, setSucces] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            // name: ,
            // address: ,
            // stateId: {
            //     value: 
            // },
            // contractorLogoId: {
            //     value: 
            // },
            // clientLogoId: {
            //     value:
            // },
            // eta: {
            //     value: 
            // },
            // started: {
            //     value: 
            // },
            // completed: {
            //     value:
            // }
        }
        axios.put(`${apiAddress}/api/projects/${projectKey}`, data)
        .then((response) => {
            setSucces(true)
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Changes saved</h1>
                    <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Edit Project</h1>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>save</Button>
                        <Button variant='contained' color='error' onClick={close}>cancel</Button>
                    </div>
                </form>
            ) }
        </>
    )
}

export const ModalAdd = ({close}) => {

    const [success, setSucces] = useState(false)
    const [status, setStatus] = useState('')
    const [staff, setStaff] = useState([])
    const [staffSelected, setStaffSelected] = useState('')
    const [material, setMaterial] = useState([])
    const [materialSelected, setMaterialSelected] = useState('')

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const handleAddStaff = (e) => {
        e.preventDefault()
        if(staffSelected != ''){
            setStaff([...staff, staffSelected])
            setStaffSelected('')
        }
    }

    const handleAddMaterial = (e) => {
        e.preventDefault()
        if(materialSelected != ''){
            setMaterial([...material, materialSelected])
            setMaterialSelected('')
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            // name: e.target[0].value,
            // adress: e.target[2].value,
            // stateId: staff,
            // siteStateId: ,
            // contractorLogoId: ,
            // clientLogoId: ,
            // eta: ,
            // started: ,
            // completed: ,
        }
        axios.post(`${apiAddress}/api/project`, data)
        .then(
            setSucces(true)
        )
    }

    const infoPrueba = [{
        name: 'jesus'
    },{
        name: 'diego'
    },{
        name: 'maria'
    },{
        name: 'luis'
    }]

    const infoPrueba2 = [{
        materialName: 'soldadura en polvo'
    },{
        materialName: 'cable inalambrico',
    },{
        materialName: 'tornillos para clavos',
    }]

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Project added</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add Project</h1>
                    <TextField label='Name'/>
                    <div className="Select">
                        <p>Project status:</p>
                        <Select
                            label='Estado'
                            onChange={handleStatus}
                            value={status}
                            id='statusSelect'
                            labelId="statusLabel"
                        >
                            <MenuItem value='En proceso'>In progress</MenuItem>
                            <MenuItem value='Activado'>Active</MenuItem>
                            <MenuItem value='Desactivado'>disabled</MenuItem>
                        </Select>
                    </div>
                    <h4>Starff: {staff.map((person) => <>{person}, </> )}</h4>
                    <h4>Materials: {material.map((material) => <>{material}, </>)}</h4>
                    <div className='staffSelect' >
                        <Select className="select" id='StaffSelector' onChange={(e) => setStaffSelected(e.target.value)}>
                            {infoPrueba.map((person) => <MenuItem value={person.name}>{person.name}</MenuItem> )}
                        </Select>
                        <Tooltip title='Add staff'>
                            <Fab color='info' onClick={handleAddStaff}><AddIcon/></Fab>
                        </Tooltip>
                    </div>
                    <div className='materialSelect' >
                        <Select className="select" id='MaterialSelector' onChange={(e) => setMaterialSelected(e.target.value)}>
                            {infoPrueba2.map((material) => <MenuItem value={material.materialName}>{material.materialName}</MenuItem> )}
                        </Select>
                        <Tooltip title='Add material'>
                            <Fab color='info' onClick={handleAddMaterial}><AddIcon/></Fab>
                        </Tooltip>
                    </div>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>save</Button>
                        <Button variant='contained' color='error' onClick={close}>close</Button>
                    </div>
                </form>
            ) }
        </>
    )
}

export const AddReportModal = ({close}) => {

    const [success, setSuccess] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            reportUserId: e.target[1].value,
            projectId: e.target[3].value,
            dateReported: e.target[5].value
        }
        axios.post(`${apiAddress}/api/report/`, data)
        .then((response) => {
            setSuccess(true)
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Report added</h1>
                    <Button variant='contained' color='error' onClick={close}>Close</Button>
                </div>
            ):(
                <form className='Modal' onSubmit={handleSubmit}>
                    <div className="header">
                        <div className='category'>
                            <h1>Category: </h1>
                            <Select
                                id='noteType'
                            >
                                <MenuItem value='General'>General</MenuItem>
                                <MenuItem value='Materials'>Materials</MenuItem>
                                <MenuItem value='Tools'>Tools</MenuItem>
                                <MenuItem value='Access'>Access</MenuItem>
                                <MenuItem value='schedule'>schedule</MenuItem>
                            </Select>
                        </div>

                        <Tooltip title='Add report'>
                            <Fab color='info' type='submit'>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </div>
                    <div className="info">
                        <div>
                            
                        </div>
                    
                        <TextField multiline label='Notes'/>
                        <input type='file' multiple/>
                    </div>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </form>
            ) }
        </>
    )
}

export const deleteModal = ({close, projectKey}) => {
    const [success, setSuccess] = useState(false)

    async function handleDelete(){
        e.preventDefault()
        axios.delete(`${apiAddress}/api/report/${projectKey}`)
        .then((response) => {
            setSuccess(true)
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>The project has been deleted</h1>
                    <Button variant='contained' color='error' onClick={close}>Close</Button>
                </div>
            ):(
                <div className='Modal'>
                    <Button variant='contained' onClick={handleDelete}>Delete</Button>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </div>
            ) }
        </>
    )
}