import { Button, TextField, IconButton, Tooltip } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios'

export const ImagesModal = ({close, reportLineKey}) => {

	console.log(reportLineKey)

	useEffect(() => {
		axios.get(`${apiAddress}/data/images/${reportLineKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
		.then((response) => {
			console.log(response)
		})
	})

	function uploadImage(e){
		e.preventDefault()
		axios.post(`${apiAddress}/data/images/${reportLineKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
	}

	return(
		<div className='Modal'>
			<h1>Report line images</h1>
			<form onSubmit={uploadImage}>
				<input type='file'/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit'> <UploadIcon/> </IconButton>
				</Tooltip>
			</form>
			<Button variant='contained' color='error' onClick={close}>close</Button>
		</div>
	)
}

export const FilesModal = ({close}) => {
	return(
		<div className='Modal'>
			<Button variant='contained' color='error' onClick={close}>close</Button>
		</div>
	)
}