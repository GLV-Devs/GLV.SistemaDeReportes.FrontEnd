import { ModalAdd, ModalEdit, ModalView } from "../components/ModalProjects";
import { Button, Tooltip, CircularProgress } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { apiAddress } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Projects = () => {

    useEffect(() => {getList()}, [])

    const navigate = useNavigate()

    const { accessToken } = useContext(AppContext)
    const [edit, setEdit] = useState(false)
    const [add, setAdd] = useState(false)
    const [view, setView] = useState(false)
    const [selected, setSelected] = useState('')
    const [list, setList] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [listError, setListError] = useState(false)
    const [listLoading, setListLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')

    async function getList(){
        setListError(false)
        setListLoading(true)
        axios.get(`${apiAddress}/api/projects`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            // console.log(response)
            if(response.status){
                setListLoading(false)
                setListError(false)
                if(response.data.data == null){
                    setList([{name: '', id: ""}])
                }else{
                    setList(response.data.data)
                }
            }
        })
        .catch((err) => {
            setListError(true)
            setListLoading(false)
            console.log(err)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    return(
        <div className="Projects">
            <h1>Project List</h1>
            <Button variant="contained" onClick={() => {setAdd(true)}}>Add Project</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            { !listLoading && !listError && 
            <>
                { list.map((item) => (
                    <div key={item.id} className='LI'>
                        <div className='info'>
                            <h3>{item.name}</h3>
                        </div>

                        <div className="Buttons">
                            <Tooltip title='Edit'>
                                <Button onClick={ () => {setSelectedItem(item); setEdit(true);} }> <ModeEditIcon/> </Button>
                            </Tooltip>
                            <Tooltip title='See info'>
                                <Button onClick={ () => {setView(true); setSelectedItem(item);} }> <VisibilityIcon/> </Button>
                            </Tooltip>
                        </div>
                    </div>
                )) }
            </> }
            

            { edit && <ModalEdit projectKey={selectedItem.id} close={() => {setEdit(false); getList()}}/> }
            { add &&  <ModalAdd close={() => {setAdd(false); getList()}}/>}
            { view && <ModalView projectId={selectedItem} close={() => {setView(false); getList()}}/> }
        </div>
    )
}

export default Projects;