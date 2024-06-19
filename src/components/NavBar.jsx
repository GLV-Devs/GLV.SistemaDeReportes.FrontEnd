import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem, IconButton, Drawer, Tooltip } from "@mui/material";
import { AppContext } from "../context/AppContext";
import { useContext, useState } from "react";
import { accessToken, apiAddress } from "../globalResources";
import MenuIcon from '@mui/icons-material/Widgets';
import PeopleIcon from '@mui/icons-material/People';
import ProductsIcon from '@mui/icons-material/Inventory';
import IdentificationTypesIcon from '@mui/icons-material/Fingerprint';
import SiteStateIcon from '@mui/icons-material/Place';
import RoleIcon from '@mui/icons-material/AssignmentInd';
import ReportLineCategoryIcon from '@mui/icons-material/Article';
import ProjectStateIcon from '@mui/icons-material/AssignmentTurnedIn';
import ProjectsIcon from '@mui/icons-material/ElectricalServices';
import UsersIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

const NavBar = () => {

    const { userInfo } = useContext(AppContext)
    const navigate = useNavigate()
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null)
    const open = Boolean(adminMenuAnchor)

    const [openMenu, setOpenMenu] = useState(false)

    const openAdminMenu = (e) => {
        setAdminMenuAnchor(e.currentTarget)
    }

    async function logOut(){
        axios.delete(`${apiAddress}/api/identity/`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then(
            navigate('/login')
        )
    }

    return(
        <div className="NavBar">
            <div style={{display: 'flex'}}>
                <h4>Control System - {userInfo.names} {userInfo.lastName}</h4>
                <Tooltip title='My profile'>
                    <IconButton onClick={() => navigate('/main/profile')}> <UsersIcon/> </IconButton>
                </Tooltip>
            </div>

            <div className="Buttons">
                <Tooltip title='Menu'>
                    <IconButton size='large' onClick={() => setOpenMenu(true)}> <MenuIcon/> </IconButton>
                </Tooltip>
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
            </div>
            <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right' sx={{'textAlign': 'start'}}>
                <Button onClick={() => {navigate('/main/personas'); setOpenMenu(false)}}> {<PeopleIcon/>} Persons</Button>
                <Button onClick={() => {navigate('/main/productos'); setOpenMenu(false)}}> {<ProductsIcon/>} Products</Button>
                <Button onClick={() => {navigate('/main/proyectos'); setOpenMenu(false)}}> {<ProjectsIcon/>} Projects</Button>
                <Button onClick={() => {navigate('/main/ProjectStates'); setOpenMenu(false)}}> {<ProjectStateIcon/>} Project States</Button>
                <Button onClick={() => {navigate('/main/SiteStates'); setOpenMenu(false)}}> {<SiteStateIcon/>} Site States</Button>
                <Button onClick={() => {navigate('/main/ManageIdTypes'); setOpenMenu(false)}}> {<IdentificationTypesIcon/>} Identification Type</Button>
                <Button onClick={() => {navigate('/main/ProjectRoles'); setOpenMenu(false)}}> {<RoleIcon/>} Project Roles</Button>
                <Button onClick={() => {navigate('/main/reportlinescategories'); setOpenMenu(false)}}> {<ReportLineCategoryIcon/>} Report Line Categories</Button>
                <Button onClick={() => {navigate('/main/users'); setOpenMenu(false)}}> <UsersIcon/> Users</Button>
            </Drawer>
        </div>

    )
}

export default NavBar;



                // <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/personas')}>Staff</Button>
                // <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/proyectos')}>projects</Button>
                // <Button variant="text" size="small" color='inherit' onClick={() => navigate('/main/productos')}>Products</Button>
                // <Button variant='text' size='small' color='inherit' onClick={openAdminMenu}>Admin</Button>


                {/*<Menu
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
                </Menu>*/}