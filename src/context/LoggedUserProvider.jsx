import React, { useState } from "react";
import { loggedUserContext } from "./loggedUserContext";

const LoggedUserProvider = ({children}) => {

    const [userRealName, setUserRealName] = useState('')
    const [logged, setLogged] = useState(false)
    const [admin, setAdmin] = useState(false)

    return(
    <loggedUserContext.Provider value={{userRealName, setUserRealName, admin, setAdmin, logged, setLogged}}>
        {children}
    </loggedUserContext.Provider>
    )
}

export default LoggedUserProvider