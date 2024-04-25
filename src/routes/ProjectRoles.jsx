import { Button, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { apiAddress } from "../globalResources";

const ProjectRoles = () => {

    const [addModal, setAddModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setLoading(true)
        const data = {
            name: e.target[0].value,
            symbol: e.target[2].value,
            format: e.target[4].value,
        }
        axios.post(`${apiAddress}/api/identificationtype`, data)
        .then((response) => {
            if(response.status == 200){
                setSuccess(true)
            }
        })
        .catch((err) => {
            if(err){
                setLoading(false)
                setError(true)
            }
        })
    }

    return(
        <div className='ProjectRoles'>
            <h1>Project Roles Manager</h1>
            <Button variant='contained' onClick={() => setAddModal(true)}>new project role</Button>

            { addModal && 
                <form className="Modal" onSubmit={handleSubmit}>
                    <h1>Add New Project Role</h1>
                    {success ? (
                        <>
                            <h1>Added Successfully</h1>
                            <Button variant="contained" color='error' onClick={() => setAddModal(false)}>close</Button>
                        </>
                    ):(
                        <>
                            <TextField label='Name' disabled={loading}/>
                            <TextField label='Symbol' disabled={loading}/>
                            <TextField label='Format' disabled={loading}/>
                            {error && <h3 style={{color: 'red'}}>An error has ocurred</h3>}
                            <div className='Buttons'>
                                <Button variant="contained" type='submit' disabled={loading}>{loading ? (<CircularProgress/>):(<>save</>)}</Button>
                                <Button variant="contained" color='error' disabled={loading} onClick={() => setAddModal(false)}>cancel</Button>
                            </div>
                        </>)}
                </form>
            }
        </div>  
    )
}

export default ProjectRoles;