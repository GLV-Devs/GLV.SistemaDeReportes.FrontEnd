import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { apiAddress, accessToken } from "../globalResources"
import axios from "axios"
import { CircularProgress, Tooltip } from "@mui/material"
import { AddUser, EditUser, DeleteUser } from "../components/usersModal"

export const Users = () => {
    
    const navigate = useNavigate()

    const [addModal, setAddModal] = useState(false)    
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [listLoading, setListLoading] = useState(true)
    const [listError, setListError] = useState(false)
    const [list, setList] = useState([])

    function getList(){
        setListError(false)
        axios.get(`${apiAddress}/api/`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((response) => {
            setList(response.data.data)
            setListLoading(false)
        }).catch((err) => {
            console.log(err.response)
            setListError(true)
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
                    { list.map((item) => {
                        <div className="LI" key={item.id}>
                            <h3>{item.names} {item.lastNames}</h3>
                            <div className='Buttons'>
                                <Tooltip title='Add user'>
                                    <Button></Button>
                                </Tooltip>
                                <Tooltip title='Edit user'>
                                    <Button></Button>
                                </Tooltip>
                                <Tooltip title='Delete user'>
                                    <Button></Button>
                                </Tooltip>
                            </div>
                        </div>
                    }) }
                </div>
            }

        { addModal && <AddUser/> }
        { editModal && <EditUser/> }
        { deleteModal && <DeleteUser/> }
        </div>
    )
}

export default Users;