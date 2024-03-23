import { TextField, Button, InputLabel, Select, MenuItem } from "@mui/material";

const EditPersonal = () => {

    async function handleSubmit(e){
        e.preventDefault()
        const data = {
            name: e.target[0].value,
            address: e.target[2].value,
            idType: e.target[4].value,
            idNumber: e.target[6].value,
            phone: e.target[8].value,
        }
        console.log(data)
    }

    return(
        <form className="AddPersonal" onSubmit={handleSubmit}>
            <h1>Editar personal</h1>
            <TextField label='Nombre'/>
            <TextField label='Direccion'/>
            <div>
                <InputLabel id="idType">Tipo</InputLabel>
                <Select
                    label='Tipo de identificacion'
                    labelId="idType"
                    id='idType'
                >
                    <MenuItem value='V'>V</MenuItem>
                    <MenuItem value='J'>J</MenuItem>
                    <MenuItem value='E'>E</MenuItem>
                </Select>
                <TextField label='Identificacion' type="number"/>
            </div>
            <TextField label='Telefono' />

            <Button type='submit' variant="contained">Guardar</Button>
        </form>
    )
}

export default EditPersonal;