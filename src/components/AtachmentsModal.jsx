import { Button, TextField, IconButton, Tooltip, CircularProgress } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import { apiAddress, accessToken } from '../globalResources'
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

export const ImagesModal = ({close, reportLineInfo, update}) => {

	useEffect(() => {
		function filter(){
			let temp = []
			reportLineInfo.files.map((item) => {
				console.log(item)
				if(item.fileCategory == 'Image'){
					temp.push(item)
				}
			})
			setImagesList(temp)
		}

		filter()
	},[])

	const [imagesList, setImagesList] = useState([])
	const [uploading, setUploading] = useState(false)

	const navigate = useNavigate()

	function uploadImage(e){
		e.preventDefault()
		setUploading(true)
		const imageInput = document.getElementById('imageInput')
		const files = Array.from(imageInput.files)

		const uploadPromises = files.map((item) => {
			return axios.post(`${apiAddress}/data/images/report/${reportLineInfo.id}`, item, {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'image'}})
		})
		Promise.all(uploadPromises)
		.then((response) => {
			console.log(response)
			response.forEach((res) => {
				setImagesList(I => [...I, {key: res.data.data[0].key}])
			})	
			update()		
		}).catch((err) => {
			console.log(err.response)
			if(err.response.status == 401){
				navigate('/Login')
			}
		}).finally(()=> {
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
				<input type='file' id='imageInput' disabled={uploading} multiple/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit' disabled={uploading}> {uploading ? (<CircularProgress size={24}/>):(<UploadIcon/>)} </IconButton>
				</Tooltip>
			</form>
			{ imagesList.map((item) => (
				<div style={{border: '1px solid black', width: '95%', display: 'inline-flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', overflow: 'hidden'}}>
					<img key={item.key} src={`${apiAddress}/data/images/${item.key}`} style={{width: '90%', height: 'auto'}}/>
					<IconButton onClick={() => deleteImage(item.key)} size='large'> <DeleteIcon/> </IconButton>
				</div>
			)) }
			<Button variant='contained' color='error' onClick={close} disabled={uploading}>close</Button>
		</div>
	)
}

export const FilesModal = ({close, reportLineInfo, update}) => {

	console.log(reportLineInfo)

	useEffect(() => {
		function filter(){
			let temp = []
			reportLineInfo.files.map((item) => {
				console.log(item)
				if(item.fileCategory == 'File'){
					temp.push(item)
				}
			})
			setShowList(temp)
		}

		filter()
	},[])

	const navigate = useNavigate()

	const [uploading, setUploading] = useState(false)
	const [showList, setShowList] = useState([])

	const handleUpload = (e) => {
		e.preventDefault()
		setUploading(true)
		const fileName = document.getElementById('inputName')
		const file = document.getElementById('fileInput')
		axios.post(`${apiAddress}/data/files/report/${reportLineInfo.id}/${fileName.value}`, file[0], {headers: {'Authorization': `Session ${accessToken}`, 'Content-Type': 'application/file'}})
		.then((res) => {
			console.log(res)
			setShowList([...showList, res.data.data[0]])
		}).catch((err) => {
			console.log(err.response)
			if(err.response.status == 401){
				navigate('/Login')
			}
		}).finally(() => {
			setUploading(false)
		})
	}

	function handleDelete(){
		console.log('borrado')
	}

	function handleDownload(){
		console.log('descargado')
	}

	return(
		<div className='Modal'>
			<h1>Report line files</h1>
			<form onSubmit={handleUpload} className='uploadFile'>
				<TextField label="File's name" disabled={uploading} id='inputName'/>
				<input type='file' id='fileInput' disabled={uploading}/>
				<Tooltip title='Upload'>
					<IconButton variant='contained' size='large' type='submit' disabled={uploading}>{uploading ? (<CircularProgress size={24}/>):(<UploadIcon/>)} </IconButton>
				</Tooltip>
			</form>
			{ showList.map((item) => (
				<div style={{border: '1px solid black', width: 'calc(95% - 30px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '25px', padding: '0px 15px'}}>
					<h4 style={{width: '85%', textAlign: 'start'}}>{item.fileData}</h4>
					<div className='Buttons' style={{width: '15%', display: 'flex', alignItems: 'center'}}>
						<IconButton onClick={() => handleDelete(item.key)} size='large'> <DeleteIcon/> </IconButton>
						<IconButton onClick={() => handleDownload(item.key)} size='large'> <DownloadIcon/> </IconButton>
					</div>
				</div>
			)) }
			<Button variant='contained' color='error' onClick={close} disabled={uploading}>close</Button>
		</div>
	)
}