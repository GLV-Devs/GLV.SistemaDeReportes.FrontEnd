import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const Main = () => {
    return(
        <div className="Main">
            <NavBar />
            <Outlet />
        </div>
    )
}

export default Main;