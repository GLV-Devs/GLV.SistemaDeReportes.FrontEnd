import React, { useState } from "react";
import { AppContext } from "./AppContext";

const AppContextProvider = ({children}) => {

    const [accessToken, setAccessToken] = useState('')
    const [userInfo, setUserInfo] = useState('')

    return(
    <AppContext.Provider value={{accessToken, setAccessToken, userInfo, setUserInfo}}>
        {children}
    </AppContext.Provider>
    )
}

export default AppContextProvider