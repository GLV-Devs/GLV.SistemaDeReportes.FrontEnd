import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { CircularProgress } from "@mui/material";
import { getRolesList, getIdTypeList, getProductList, getReportLineCategoryList, getProjectStateList, getSiteStateList } from "../getLists";

const Main = () => {

    const { setRolesList, setProductList, setIdTypeList, setReportLineCategoryList, setProjectStateList, setSiteStateList } = useContext(AppContext)
    
    const [ready, setReady] = useState(false)

    useEffect(() => {
        getAllLists()
        .finally(() => {
            setReady(true)
        })
    }, [])

    async function getAllLists(){
        setRolesList(await getRolesList())
        setProductList(await getProductList())
        setIdTypeList(await getIdTypeList())
        setReportLineCategoryList(await getReportLineCategoryList())
        setProjectStateList(await getProjectStateList())
        setSiteStateList(await getSiteStateList())
    }



    return(
        <div className="Main" style={{height: '100%'}}>
            <NavBar />
            { ready ? (
                    <Outlet />
            ):(
                <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </div>
            )}
        </div>
    )
}

export default Main;