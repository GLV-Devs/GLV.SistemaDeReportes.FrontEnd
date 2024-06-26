import { Button, TextField, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Fab, Tooltip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useState, useRef } from "react"
import { faker } from '@faker-js/faker'

export const ModalView = ({info, close}) => {

    const [addNote, setAddNote] = useState(false)

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

            { addNote && <AddNoteModal close={ () => setAddNote(false) }/> }
        </div>
    )
}

export const ModalEdit = ({close}) => {

    const [success, setSucces] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        setSucces(true)
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
    const [idType, setIdType] = useState('')
    const [status, setStatus] = useState('')
    const [staff, setStaff] = useState([])
    const [staffSelected, setStaffSelected] = useState('')

    const handleIdType = (e) => {
        setIdType(e.target.value)
    }

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const handleAddStaff = (e) => {
        e.preventDefault()
        setStaff([...staff, staffSelected])
    }

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            name: e.target[0].value,
            state: e.target[2].value,
            personal: staff,
        }
        setSucces(true)
        console.log(data)
    }

    const infoPrueba = [{
        name: faker.person.fullName()
    },{
        name: faker.person.fullName()
    },{
        name: faker.person.fullName()
    },{
        name: faker.person.fullName()
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
                    <div className='staffSelect' >
                        <Select className="select" id='StaffSelector' onChange={(e) => setStaffSelected(e.target.value)}>
                            {infoPrueba.map((person) => <MenuItem value={person.name}>{person.name}</MenuItem> )}
                        </Select>
                        <Tooltip title='Add staff'>
                            <Fab color='info' onClick={handleAddStaff}><AddIcon/></Fab>
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

export const AddNoteModal = ({close}) => {

    const [success, setSuccess] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            category: e.target[1].value,
            content: e.target[3].value,
            files: e.target[5].value
        }
        setSuccess(true)
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
                        <input type='file'/>
                    </div>
                    <Button variant='contained' color='error' onClick={close}>Cancel</Button>
                </form>
            ) }
        </>
    )
}
