import { Button } from "@mui/material"

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

export const ModalEdit = (info) => {
    return(
        <div className='Modal'>

        </div>
    )
}

export const ModalAdd = (info) => {
    return(
        <div className='Modal'>

        </div>
    )
}