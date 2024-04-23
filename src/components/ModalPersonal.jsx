import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react"
import axios from "axios";
import { apiAddress } from '../globalResources'

export const ModalView = ({info, close}) => {

    const [deleteCofirm, setDeleteConfirm] = useState(false)

    axios.get(`${apiAddress}/api/person/${info.id}`)

    return(
        <div className='Modal'>
            <h1>Info</h1>
            <h3>Name: {info.name}</h3>
            <h3>Identification: {info.idType}-{info.idNumber}</h3>
            <h3>Address: {info.address}</h3>
            <h3>Phone: {info.phone}</h3>
            <Button variant='contained' color='error' onClick={setDeleteConfirm(true)}></Button>
            <Button variant="contained" color='error' onClick={close}>close</Button>

            { deleteCofirm && <deleteModal close={() => setDeleteConfirm(false)} personKey={personKey}/> }
        </div>
    )
}

export const ModalEdit = ({close}) => {

    const [success, setSucces] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        const data = {
            Names: e.target[0].value,
            LastNames: e.target[2].value,
            DateOfBirth: Date(e.target[4].value),
            IdentificationTypeId: e.target[7].value,
            IdentificationNumber: Number(e.target[9].value),
            DriverLicensePhotoId: e.target[11].value,
            PassportPhotoId: e.target[12].value,
            PhoneNumber: e.target[13].value,
            ManagedProjects: e.target[15].value,
        }
        axios.put(`${apiAddress}/api/person/${info.id}`, data)
        .then(
            setSucces(true)
        )
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
                    <TextField label='Names'/>
                    <TextField label='LastNames'/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker/>
                    </LocalizationProvider>
                    <div>
                        <InputLabel id='idType'>Identification</InputLabel>
                        <Select label='Identificacion'>
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                        <TextField type="text"/>
                    </div>
                    <div>
                        <p>Driver licence photo:</p>
                        <input type="file" />
                    </div>
                    <div>
                        <p>Passport photo:</p>
                        <input type="file" />
                    </div>
                    <TextField label='Phone'/>
                    <div>
                        <InputLabel id='ManagedProjects'>managed Projects</InputLabel>
                        <Select label='ManagedProjects' className="Select">
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                    </div>
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
            Names: e.target[0].value,
            LastNames: e.target[2].value,
            DateOfBirth: Date(e.target[4].value),
            IdentificationTypeId: e.target[7].value,
            IdentificationNumber: Number(e.target[9].value),
            DriverLicensePhotoId: e.target[11].value,
            PassportPhotoId: e.target[12].value,
            PhoneNumber: e.target[13].value,
        }
        axios.post(`${apiAddress}/api/identity`, data)
        .then(
            setSucces(true)
        )
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
                    <TextField label='Names' type="text"/>
                    <TextField label='Lastnames'/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker/>
                    </LocalizationProvider>
                    <div>
                        <InputLabel id='idType'>Identification</InputLabel>
                        <Select label='Identificacion'>
                            <MenuItem value='V'>V</MenuItem>
                            <MenuItem value='J'>J</MenuItem>
                            <MenuItem value='E'>E</MenuItem>
                        </Select>
                        <TextField type="text"/>
                    </div>
                    <div>
                        <p>Driver licence photo:</p>
                        <input type="file" />
                    </div>
                    <div>
                        <p>Passport photo:</p>
                        <input type="file" />
                    </div>
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

export const deleteModal = ({close, personKey}) => {
    const [success, setSuccess] = useState(false)

    async function handleDelete(){
        e.preventDefault()
        axios.delete(`${apiAddress}/api/person/${personKey}`)
        .then((response) => {
            setSuccess(true)
        })
    }

    return(
        <>
            { success ? (
                <div className="Modal">
                    <h1>The person has been deleted</h1>
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