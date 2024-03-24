import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { useState } from "react"

export const ModalView = ({info, close}) => {

    const [addNote, setAddNote] = useState(false)

    return(
        <div className='Modal'>
            <h1>Informacion</h1>
            <h3>Nombre: {info.name}</h3>
            <h3>Identificacion: {info.idType}-{info.idNumber}</h3>
            <h3>Direccion: {info.address}</h3>
            <h3>Telefono: {info.phone}</h3>
            <h3>Estado: {info.status}</h3>
            <div className="Buttons">
                <Button variant='contained' onClick={() => setAddNote(true)}>Agregar nota</Button>
                <Button variant="contained" color='error' onClick={close}>Cerrar</Button>
            </div>
            { addNote && <AddNoteModal close={() => setAddNote(false)}/> }
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
                    <h1>Cambios Guardados</h1>
                    <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Editar</h1>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>guardar</Button>
                        <Button variant='contained' color='error' onClick={close}>cerrar</Button>
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
            idType: e.target[2].value,
            idNumber: e.target[4].value,
            address: e.target[6].value,
            phone: e.target[8].value,
            state: e.target[10].value,
        }
        console.log(data)
        setSucces(true)
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Proyecto registrado</h1>
                    <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Agregar Proyecto</h1>
                    <TextField label='Nombre'/>
                    <div>
                        <Select label='Identificacion'>
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                        <TextField label='Identificacion'/>
                    </div>
                    <TextField label='Direccion'/>
                    <TextField label='Telefono'/>
                    <div className="Select">
                        <p>Estado del proyecto:</p>
                        <Select
                            label='Estado'
                            onChange={handleStatus}
                            value={status}
                            id='statusSelect'
                            labelId="statusLabel"
                        >
                            <MenuItem value='En proceso'>En proceso</MenuItem>
                            <MenuItem value='Activado'>Activado</MenuItem>
                            <MenuItem value='Desactivado'>Desactivado</MenuItem>
                        </Select>
                    </div>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>guardar</Button>
                        <Button variant='contained' color='error' onClick={close}>cerrar</Button>
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
        console.log(data)
        setSuccess(true)
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Nota agregada</h1>
                    <Button variant='contained' color='error' onClick={close}>Cerrar</Button>
                </div>
            ):(
                <form className='Modal' onSubmit={handleSubmit}>
                    <div className="header">
                        <h1>Titulo: </h1>
                        <Button variant="contained" type="submit">Agregar</Button>
                    </div>
                    <div className="info">
                        <div>
                            <InputLabel id='noteType'>Tipo de nota</InputLabel>
                            <Select
                                LabelId='noteType'
                                id='noteType'
                            >
                                <MenuItem value='General'>General</MenuItem>
                                <MenuItem value='Materiales'>Materiales</MenuItem>
                                <MenuItem value='Equipos'>Equipos</MenuItem>
                                <MenuItem value='Acceso'>Acceso</MenuItem>
                                <MenuItem value='Cronograma'>Cronograma</MenuItem>
                            </Select>
                        </div>
                    
                        <TextField label='nota'/>
                        <input type='file'/>
                    </div>
                    <Button variant='contained' color='error' onClick={close}>Cancelar</Button>
                </form>
            ) }
        </>
    )
}

export const ListNoteModal = () => {
    return(
        <className>
        </className>
    )
}
