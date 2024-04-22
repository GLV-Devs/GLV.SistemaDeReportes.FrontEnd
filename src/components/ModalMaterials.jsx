import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { useState } from "react"

export const ModalView = ({info, close}) => {
    return(
        <div className='Modal'>
            <h1>Informacion</h1>
            <h3>Nombre: {info.name}</h3>
            <h3>unidad: {info.unit}</h3>
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
            unit: e.target[2].value,
        }
        console.log(data)
        setSucces(true)
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>Material Added</h1>
                    <Button variant='contained' color='error' onClick={close}>cerrar</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Agregar Material</h1>
                    <TextField label='Nombre'/>
                    <TextField label='Unit.'/>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>save</Button>
                        <Button variant='contained' color='error' onClick={close}>cancel</Button>
                    </div>
                </form>
            ) }
        </>
    )
}