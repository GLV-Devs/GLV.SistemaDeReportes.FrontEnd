import { Button, TextField, IconButton, Tooltip, CircularProgress } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';

export const ImagesModal = ({close, reportLineInfo, update}) => {

	const [imagesList, setImagesList] = useState(reportLineInfo.files)
	const [uploading, setUploading] = useState(false)

	const navigate = useNavigate()

	function uploadImage(e){
		e.preventDefault()
		setUploading(true)
		const imageInput = document.getElementById('imageInput')
		axios.post(`${apiAddress}/data/images/report/${reportLineInfo.id}`, imageInput.files[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image/png'}})
		.then((response) => {
			console.log(response)
			setUploading(false)
			setImagesList([...imagesList, {key: response.data.data[0].key}])
			update()
		}).catch((err) => {
			console.log(err.response)
			if(err.response.status == 401){
				navigate('/Login')
			}
			setUploading(false)
		})
	}

	function deleteImage(imgKey){
		axios.delete(`${apiAddress}/data/images/report/${imgKey}`, {headers: {'Authorization': `Session ${accessToken}`}})
		.then((response) => {
			setImagesList(imagesList.filter(key => key.key != imgKey ))
		}).catch((err) => {
			console.log(err.response)
			setImagesList(imagesList.filter(key => key.key != imgKey ))
		})
	}

	return(
		<div className='Modal'>
			<h1>Report line images</h1>
			<form onSubmit={uploadImage}>
				<input type='file' id='imageInput' disabled={uploading}/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit' disabled={uploading}> {uploading ? (<CircularProgress/>):(<UploadIcon/>)} </IconButton>
				</Tooltip>
			</form>
			{ imagesList.map((item) => (
				<div style={{border: '1px solid black', width: '95%', display: 'inline-flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', overflow: 'hidden'}}>
					<img key={item.key} src={`${apiAddress}/data/images/${item.key}`} style={{width: '90%', height: 'auto'}}/>
					<IconButton onClick={() => deleteImage(item.key)} size='large'> <DeleteIcon/> </IconButton>
				</div>
			)) }
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