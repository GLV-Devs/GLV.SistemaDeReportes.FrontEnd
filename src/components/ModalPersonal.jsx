import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { useState } from "react"

export const ModalView = ({info, close}) => {
    return(
        <div className='Modal'>
            <h1>Informacion</h1>
            <h3>Nombre: {info.name}</h3>
            <h3>Identificacion: {info.idType}-{info.idNumber}</h3>
            <h3>Direccion: {info.address}</h3>
            <h3>Telefono: {info.phone}</h3>
            <Button variant="contained" color='error' onClick={close}>Cerrar</Button>
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

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            name: e.target[0].value,
            idType: e.target[2].value,
            idNumber: e.target[4].value,
            address: e.target[6].value,
            phone: e.target[8].value,
        }
        console.log(data)
        setSucces(true)
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Personal registrado</h1>
                    <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Agregar Personal</h1>
                    <TextField label='Nombre'/>
                    <div>
                        <InputLabel id='idType'>Identificacion</InputLabel>
                        <Select label='Identificacion'>
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                        <TextField />
                    </div>
                    <TextField label='Direccion'/>
                    <TextField label='Telefono'/>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>guardar</Button>
                        <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                    </div>
                </form>
            ) }
        </>
    )
}