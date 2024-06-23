import { useContext, useState, useEffect } from 'react'
import { AppContext } from "../context/AppContext";
import { IconButton, Tooltip, Button } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset';
import { apiAddress, accessToken } from "../globalResources"
import { EditUser, ChangePassword } from "../components/usersModal"
import UsersIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { getItem } from '../functions';
import { message } from "antd";


const Profile = () => {

	const { userInfo, idTypeList } = useContext(AppContext)
	console.log(userInfo)
	const [changePassModal, setChangePassModal] = useState(false)
	const [editProfileModal, setEditProfileModal] = useState(false)
	const [idType, setIdType] = useState('')
	const [personalEmail, setPersonalEmail] = useState('none')
	const [userEmail, setUserEmail] = useState('none')
	const [personalPhoneNumber, setPersonalPhoneNumber] = useState('none')
	const [userPhoneNumber, setUserPhoneNumber] = useState('none')
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		if(userInfo.identificationTypeId != null){
			setIdType(getItem(userInfo.identificationTypeId, idTypeList).symbol)
		}
		if(userInfo.personalEmail != null){
			setPersonalEmail(userInfo.personalEmail)
		}
		if(userInfo.userEmail != null){
			setUserEmail(userInfo.userEmail)
		}
		if(userInfo.userPhoneNumer != null){
			setUserPhoneNumber(userInfo.userPhoneNumer)
		}
		if(userInfo.personalPhoneNumber != null){
			setPersonalPhoneNumber(userInfo.personalPhoneNumber)
		}
	}, [])

	return(
		<div className='Profile'>
			<h1>Welcome, {`${userInfo.names}  ${userInfo.lastNames}`}</h1>
			<UsersIcon size={60}/>
			<h3>Date of birth: {userInfo.dateOfBirth}</h3>
			<h3>Identification: {idType} {userInfo.identificationNumber}</h3>
			<h3>Personal email: {personalEmail}</h3>
			<h3>User email: {userEmail}</h3>
			<h3> Username: {userInfo.userName}</h3>
			<h3>Personal phone number: {personalPhoneNumber}</h3>
			<h3>User phone number: {userPhoneNumber}</h3>
			<div className='Buttons' style={{display: 'flex', gap: '15px'}}>
				<Button variant='contained' onClick={() => setChangePassModal(true)}> <LockResetIcon/>Change password</Button>
				<Button variant='contained' onClick={() => setEditProfileModal(true)}> <EditIcon/>Edit Profile</Button>
			</div>


			{ changePassModal && <ChangePassword close={() => setChangePassModal(false)}/> }
			{ editProfileModal && <ChangePassword close={() => setEditProfileModal(false)}/> }

		</div>
	)
}

export default Profile;