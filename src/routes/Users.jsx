import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { apiAddress, accessToken } from "../globalResources"
import axios from "axios"
import { CircularProgress, Tooltip, Button } from "@mui/material"
import { AddUser, EditUser, DeleteUser, ChangePassword } from "../components/usersModal"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LockResetIcon from '@mui/icons-material/LockReset';

const Users = () => {
    
    const navigate = useNavigate()
    useEffect(() => {
        getList()
    }, [])

    const [addModal, setAddModal] = useState(false)    
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [passwordModal, setPasswordModal] = useState(false)
    const [listLoading, setListLoading] = useState(true)
    const [listError, setListError] = useState(false)
    const [list, setList] = useState([])
    const [selectedItem, setSelectedItem] = useState('')
    const hasUser = false

    function getList(){
        setListLoading(true)
        setListError(false)
        axios.get(`${apiAddress}/api/account`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setList(response.data.data)
            setListLoading(false)
        }).catch((err) => {
            setListError(true)
            setListLoading(false)
            if(err.response.status == 401){
                navigate('/Login')
            }
        })
    }
    
    return(
        <div className='Users'>
            <h1>Users</h1>
            { listLoading && <CircularProgress/> }
            { listError && <>
                <h3 style={{margin: '0px', color: 'red'}}>An error has ocurred</h3>
                <Button variant='text' onClick={() => getList()}>Retry</Button>
            </> }

            { !listLoading && !listError && 
                <div>
                    { list.map((item) => (
                        <div className="LI" key={item.id}>
                            { hasUser && <>
                                <h3>{item.names} {item.lastNames}</h3>
                                <div className='Buttons'>
                                    <Tooltip title='Change Password'>
                                        <Button onClick={() => {setPasswordModal(true); setSelectedItem(item)}}> <LockResetIcon/> </Button>
                                    </Tooltip>
                                    <Tooltip title='Edit user'>
                                        <Button onClick={() => {setEditModal(true); setSelectedItem(item)}}> <ModeEditIcon/> </Button>
                                    </Tooltip>
                                    <Tooltip title='Delete user'>
                                        <Button color='error' onClick={() => {setDeleteModal(true); setSelectedItem(item)}}> <PersonOffIcon/> </Button>
                                    </Tooltip>
                                </div>
                            </> }
                            { !hasUser && <>
                                <div className='info'>
                                    <h3 style={{marginBottom: '0px'}}>{item.names} {item.lastNames}</h3>
                                    <p style={{marginTop: '0px'}}>Has no user</p>
                                </div>
                                <div className='Buttons'>
                                    <Tooltip title='Add user'>
                                        <Button onClick={() => {setAddModal(true); setSelectedItem(item)}}> <PersonAddIcon/> </Button>
                                    </Tooltip>
                                </div>
                            </> }
                        </div>
                    )) }
                </div>
            }

            { addModal && <AddUser close={() => setAddModal(false)} info={selectedItem}/> }
            { editModal && <EditUser close={() => setEditModal(false)} info={selectedItem}/> }
            { deleteModal && <DeleteUser close={() => setDeleteModal(false)} info={selectedItem}/> }
            { passwordModal && <ChangePassword close={() => setPasswordModal(false)} info={selectedItem}/> }
        </div>
    )
}

export default Users;