import { Button, TextField, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Fab, Tooltip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react"

export const ModalView = ({info, close}) => {

    const [addNote, setAddNote] = useState(false)

    const infoPrueba = [{
        date: '2024/12/24',
        cat: 'Fallas',
        user: 'Jesus',
        line: 'nothing',
    },{
        date: '2002/02/24',
        cat: 'Birthday',
        user: 'Jesus Again',
        line: 'I said Nothing',
    },{
        date: '1',
        cat: '2',
        user: '3',
        line: '4',
    }]

    return(
        <div className='ModalDual'>
            <div className='content'>
                <div className='left'>
                    <h1>Info</h1>
                    <h3>Name: {info.name}</h3>
                    <h3>Estado: {info.status}</h3>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Staff</AccordionSummary>
                        <AccordionDetails>Diego, Jesus</AccordionDetails>
                    </Accordion>
                    <Accordion className="Accordion" variant="elevation">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Users with access</AccordionSummary>
                        <AccordionDetails>Diego, Jesus</AccordionDetails>
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
                                    <AccordionDetails>Diego, Jesus</AccordionDetails>
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

    const handleIdType = (e) => {
        setIdType(e.target.value)
    }

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            name: e.target[0].value,
            state: e.target[2].value,
        }
        setSucces(true)
    }

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
