import { Route,Routes } from "react-router-dom";
import Register from "../../../modules/users/pages/Register.jsx";
import Login from "../../../modules/users/pages/Login.jsx";
import VocalNews from "../../../modules/users/pages/VocalNews.jsx";
const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/vocal-news" element={<VocalNews/>}/>
        </Routes>
    )
}
export default AppRoutes;