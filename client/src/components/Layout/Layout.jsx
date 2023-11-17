import { Outlet } from "react-router-dom";
import NavBar from '../NavBar/NavBar';
import Footer from "../Footer/Footer";


const Layout = (props) => {
  return (
    <div className='bg-body-tertiary'>
        <NavBar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn}/>
        <section className="min-h-screen h-fit bg-white">
            <Outlet />
        </section>
        <Footer/>
    </div>
  )
}


export default Layout;