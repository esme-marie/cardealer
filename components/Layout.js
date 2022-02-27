import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children, ...props }) => {
    return (
        <div>
            <div className="content">
                <Navbar {...props}/>
                { children }
                <Footer {...props}/>
            </div>
        </div>
    );
}
 
export default Layout;
