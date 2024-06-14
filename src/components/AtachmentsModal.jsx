import { Button, TextField, IconButton, Tooltip } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const ImagesModal = ({close, reportLineKey}) => {

	const navigate = useNavigate()
	// useEffect(() => { getImages() })

	console.log(`${apiAddress}/data/images/report/${reportLineKey}`)

	function getImages(){
		axios.get(`${apiAddress}/data/images/report/${reportLineKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
		.then((response) => {
			console.log(response)
		})
	}

	function uploadImage(e){
		e.preventDefault()
		const imageInput = document.getElementById('imageInput')
		axios.post(`${apiAddress}/data/images/report/${reportLineKey}`, imageInput.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image/png'}})
		.then((response) => {
			console.log(response)
		}).catch((err) => {
			console.log(err.response)
			if(err.response.status == 401){
				navigate('/Login')
			}
		})
	}

	return(
		<div className='Modal'>
			<h1>Report line images</h1>
			<form onSubmit={uploadImage}>
				<input type='file' id='imageInput'/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit'> <UploadIcon/> </IconButton>
				</Tooltip>
			</form>
			<Button variant='contained' color='error' onClick={close}>close</Button>
		</div>
	)
}

export const FilesModal = ({close}) => {

	useEffect(() => { getImages() })

	function getFiles(){
		axios.get(`${apiAddress}/data/files/report/${reportLineKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
		.then((response) => {
			console.log(response)
		})
	}

	function uploadFiles(e){
		e.preventDefault()
		const imageInput = document.getElementById('fileInput')
		axios.post(`${apiAddress}/data/files/report/${reportLineKey}`, imageInput.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image/png'}})
		.then((response) => {
			console.log(response)
		}).catch((err) => {
			console.log(err.response)
		})
	}

	return(
		<div className='Modal'>
			<h1>Report line files</h1>
			<form onSubmit={uploadFiles}>
				<input type='file' id='fileInput'/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit'> <UploadIcon/> </IconButton>
				</Tooltip>
			</form>
			<Button variant='contained' color='error' onClick={close}>close</Button>
		</div>
	)
}