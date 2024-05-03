import React, { useState } from "react";
import { AppContext } from "./AppContext";

const AppContextProvider = ({children}) => {

    const [accessToken, setAccessToken] = useState('')
    const [userInfo, setUserInfo] = useState('')
    const [rolesList, setRolesList] = useState([])
    const [productList, setProductList] = useState([])
    const [idTypeList, setIdTypeList] = useState([])
    const [reportLineCategoryList, setReportLineCategoryList] = useState([])
    const [projectStateList, setProjectStateList] = useState([])
    const [siteStateList, setSiteStateList] = useState([])

    return(
    <AppContext.Provider value={{
        accessToken,
        setAccessToken,
        userInfo,
        setUserInfo,
        rolesList,
        setRolesList,
        productList,
        setProductList,
        idTypeList,
        setIdTypeList, 
        reportLineCategoryList,
        setReportLineCategoryList,
        projectStateList,
        setProjectStateList,
        siteStateList,
        setSiteStateList,
    }}
    >
        {children}
    </AppContext.Provider>
    )
}

export default AppContextProvider