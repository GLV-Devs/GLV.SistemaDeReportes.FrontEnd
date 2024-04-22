import React, { useState } from "react";
import { AppContext } from "./AppContext";

const AppContextProvider = ({children}) => {

    const [userData, setUserData] = useState({})

    return(
    <AppContext.Provider value={{userData, setUserData}}>
        {children}
    </AppContext.Provider>
    )
}

export default AppContextProvider