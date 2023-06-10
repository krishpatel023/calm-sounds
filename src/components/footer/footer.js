import Logo from '../../assets/Logo.svg'
import './footer.css';
function Footer(){
    return(
            <div className="footer-wrapper">
                <div className="footer-section-1">
                    <div className="footer-content">
                        <img src={Logo} alt="" />
                    </div>
                </div>
                <div className="footer-section-2">
                    <h3>Designed And Developed By  <a href="https://github.com/krishpatel023" target="_blank" rel="noopener noreferrer">Krish Patel</a> </h3>
                </div>
            </div>
        )
}
export default Footer;