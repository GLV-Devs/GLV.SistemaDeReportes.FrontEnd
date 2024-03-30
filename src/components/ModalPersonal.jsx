import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { useState } from "react"

export const ModalView = ({info, close}) => {
    return(
        <div className='Modal'>
            <h1>Info</h1>
            <h3>Name: {info.name}</h3>
            <h3>Identification: {info.idType}-{info.idNumber}</h3>
            <h3>Address: {info.address}</h3>
            <h3>Phone: {info.phone}</h3>
            <Button variant="contained" color='error' onClick={close}>close</Button>
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
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Edit staff</h1>
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

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            name: e.target[0].value,
            idType: e.target[2].value,
            idNumber: e.target[4].value,
            address: e.target[6].value,
            phone: e.target[8].value,
        }
        setSucces(true)
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>staff added</h1>
                    <Button variant='contained' color='error' onClick={close}>close</Button>
                </div>
            ):(
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add staff</h1>
                    <TextField label='Name'/>
                    <div>
                        <InputLabel id='idType'>Identification</InputLabel>
                        <Select label='Identificacion'>
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                        <TextField />
                    </div>
                    <TextField label='Address'/>
                    <TextField label='Phone'/>
                    <div className='Buttons'>
                        <Button variant='contained' type='submit'>save</Button>
                        <Button variant='contained' color='error' onClick={close}>cancel</Button>
                    </div>
                </form>
            ) }
        </>
    )
}