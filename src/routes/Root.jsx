import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Footer from '../components/Footer'

const Root = () => {

    const navigate = useNavigate()
    useEffect(() => {
        navigate('/Login')
    }, [])

    return(
        <div className="container">
            <Outlet />
            {/* <Footer /> */}
        </div>
    )
}

export default Root;