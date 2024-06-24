import { ModalAdd, ModalEdit, ModalView, ExportModal } from "../components/ModalProjects";
import { Button, Tooltip, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import axios from "axios";
import { apiAddress, accessToken } from "../globalResources";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Projects = () => {

    useEffect(() => {getList()}, [])

    const navigate = useNavigate()

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
    const [exportReport, setExportReport] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [showList, setShowList] = useState([])

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
                    setShowList([{name: '', id: ""}])
                }else{
                    setList(response.data.data)
                    setShowList(response.data.data)
                }
            }
        })
        .catch((err) => {
            setListError(true)
            setListLoading(false)
            console.log(err)
            if(err.response.data.dataType == 'ErrorList'){
                messageApi.error(err.response.data.data[0].defaultMessageES);
            }
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }

    const handleSearch = (e) => {
        const results = []
        if (e.target.value == ''){
            setShowList(list)
        }else{
            list.forEach(item => {
                if(item.name.toLowerCase().includes(e.target.value.toLowerCase())){
                    results.push(item)
                }
            })
            setShowList(results)
        }
    }

    return(
        <div className="Projects">
            {contextHolder}
            <h1>Project List</h1>
            <Button variant="contained" onClick={() => {setAdd(true)}}>Add Project</Button>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }
            {/* <div className="SearchBar"> */}
            <TextField label='Search' onChange={handleSearch}/>
                {/* </div> */}
            { !listLoading && !listError && 
            <div>
                { showList.map((item) => (
                    <div key={item.id} className='LI'>
                        <div className='info'>
                            <h3>{item.name}</h3>
                        </div>

                        <div className="Buttons">
                            <Tooltip title='Export'>
                                <Button onClick={ () => {setExportReport(true); setSelectedItem(item);} }> <GetAppIcon/> </Button>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <Button onClick={ () => {setSelectedItem(item); setEdit(true);} }> <ModeEditIcon/> </Button>
                            </Tooltip>
                            <Tooltip title='See info'>
                                <Button onClick={ () => {setView(true); setSelectedItem(item);} }> <VisibilityIcon/> </Button>
                            </Tooltip>
                        </div>
                    </div>
                )) }
            </div> }
            

            { edit && <ModalEdit projectInfo={selectedItem} close={() => {setEdit(false)}}/> }
            { add &&  <ModalAdd close={() => {setAdd(false); getList()}}/>}
            { view && <ModalView projectId={selectedItem} updateList={() => getList()} close={() => {setView(false)}}/> }
            { exportReport && <ExportModal close={() => setExportReport(false)} projectId={selectedItem.id}/>}
        </div>
    )
}

export default Projects;