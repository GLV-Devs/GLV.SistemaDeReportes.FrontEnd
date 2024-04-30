import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { AppContext } from "../context/AppContext";
import { useContext, useState } from "react";
import { apiAddress } from "../globalResources";
import axios from "axios";

const NavBar = () => {

    const { setAccessToken, userInfo } = useContext(AppContext)
    const navigate = useNavigate()
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null)
    const open = Boolean(adminMenuAnchor)

    const openAdminMenu = (e) => {
        setAdminMenuAnchor(e.currentTarget)
    }

    async function logOut(){
        setAccessToken('')
        axios.delete(`${apiAddress}/api/identity/`)
        .then(
            navigate('/login')
        )
    }

    return(
        <div className="NavBar">
            <h4>Control System - {userInfo.names} {userInfo.lastName}</h4>

            <div className="Buttons">
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/personas')}>Staff</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/proyectos')}>projects</Button>
                <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/productos')}>Products</Button>
                <Button variant='text' size='small' color='inherit' onClick={openAdminMenu}>Admin</Button>
                <Button
                    aria-controls={open ? 'AdminMenu' : undefined}
                    size='small'
                    variant="text"
                    color='error'
                    id='AdminMenu'
                    onClick={logOut}
                >
                    Log out
                </Button>
                <Menu
                    id="AdminMenu"
                    anchorEl={adminMenuAnchor}
                    open={open}
                    onClose={() => setAdminMenuAnchor(null)}
                    MenuListProps={{
                    'aria-labelledby': 'AdminMenu',
                    }}
                >
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/ManageIdTypes')}}>ID Types</MenuItem>
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/ProjectStates')}}>Project States</MenuItem>
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/ProjectRoles')}}>Project Roles</MenuItem>
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/SiteStates')}}>Site states</MenuItem>
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/productos')}}>Products</MenuItem>
                    <MenuItem onClick={() => {setAdminMenuAnchor(null); navigate('/main/reportlinescategories')}}>Report Lines Categories</MenuItem>
                </Menu>
            </div>
        </div>
    )
}

export default NavBar;