
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Root = () => {

    const navigate = useNavigate()
    useEffect(() => {
        navigate('/Login')
    }, [])

    return(
        <div className="container">
            <Outlet />
        </div>
    )
}

export default Root;