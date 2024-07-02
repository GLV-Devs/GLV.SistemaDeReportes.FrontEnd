import { useState, useContext, useEffect } from "react";
import { apiAddress, accessToken } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { AddLogo } from "../components/ModalLogos";
import { useNavigate } from "react-router-dom";

const Logos = () => {

    useEffect(() => {getList()}, [])
    const navigate = useNavigate()
    const {logoKeys, setLogoKeys} = useContext(AppContext)

    function getList(){
        if(logoKeys == []){
            axios.get(`${apiAddress}/data/logos`, {headers: {'Authorization': `Session ${accessToken}`}})
            .then((res) => {
                setLogoKeys(res.data.data)
                console.log(res)
            }).catch((err) => {
                console.log(err.response)
                if(err.response.status == 401){
                    navigate('/Login')
                }
            }).finally(() => {
                setListLoading(false)
            })
        }else{
            setListLoading(false)
        }
    }

    const [listLoading, setListLoading] = useState(true)
    const [addLogoModal, setAddLogoModal] = useState(false)

    return(
        <div className="Logos">
            <h1>Logos</h1>
            <Button variant="contained" onClick={() => setAddLogoModal(true)}>New Logo</Button>
            { listLoading ? (
                <CircularProgress/>
            ):(
                <>
                    <div className="logoListBox">
                        { logoKeys.map((item) => (
                            <div className="logoBox">
                                <img src={`${apiAddress}/data/logos/${item.key}`}/>
                            </div>
                        )) }
                    </div>
                    { addLogoModal && <AddLogo close={() => setAddLogoModal(false)} update={() => {setAddLogoModal(false); getList()}}/> }
                </>
            ) }
        </div>
    )
}

export default Logos;