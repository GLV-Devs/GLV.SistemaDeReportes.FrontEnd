import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { getRolesList, getIdTypeList, getProductList, getReportLineCategoryList, getProjectStateList, getSiteStateList } from "../getLists";

const Main = () => {

    const { setRolesList, setProductList, setIdTypeList, setReportLineCategoryList, setProjectStateList, setSiteStateList } = useContext(AppContext)
    
    useEffect(() => {
        getAllLists()
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
        <div className="Main">
            <NavBar />
            <Outlet />
        </div>
    )
}

export default Main;