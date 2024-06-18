import { useContext, useState } from 'react'
import { AppContext } from "../context/AppContext";
import { IconButton, Tooltip } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset';
import { apiAddress, accessToken } from "../globalResources"
import { EditUser, ChangePassword } from "../components/usersModal"

const Profile = () => {

	const { userInfo } = useContext(AppContext)
	console.log(userInfo)
	const [changePassModal, setChangePassModal] = useState(false)

	return(
		<div className='Profile'>
			<h1>Welcome, {`${userInfo.names}  ${userInfo.lastNames}`}</h1>
			<Tooltip title='Change password'>
				<IconButton> <LockResetIcon/> </IconButton>
			</Tooltip>

			{/*{ changePassModal && <ChangePassword close={() => set} info={}/> }*/}

		</div>
	)
}

export default Profile;