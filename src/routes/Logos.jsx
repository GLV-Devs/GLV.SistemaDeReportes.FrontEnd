import { useState, useContext, useEffect } from "react";
import { apiAddress, accessToken } from "../globalResources";
import { AppContext } from "../context/AppContext";
import { CircularProgress, Button } from "@mui/material";
import axios from "axios";

const Logos = () => {

    useEffect(() => {
        axios.get(`${apiAddress}/data/logos`, {headers: {'Authorization': `Session ${accessToken}`}})
        .then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err.response)
        }).finally(() => {
            setListLoading(false)
        })
    })

    const [listLoading, setListLoading] = useState(true)
    const [showList, setShowList] = useState([])

    return(
        <div className="Logos">
            <h1>Logos</h1>
            <Button>New Logo</Button>
            { listLoading ? (
                <CircularProgress/>
            ):(
                <>
                    { showList.map((item) => (
                        <div className="LI">

                        </div>
                    )) }
                </>
            ) }
        </div>
    )
}

export default Logos;