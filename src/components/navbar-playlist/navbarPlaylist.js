import { useNavigate } from "react-router";
import ImgSquare from "../imgSquare/imgSquare";
export default function NavbarPlaylist(props){
    const navigate = useNavigate()
    const handleClick = ()=>{
        navigate(`/playlist/${props.PlaylistId}`)
    }
    return(
        <>
        {
            <button className="navbar-playlist-box" onClick={handleClick}>
                <div className="navbar-playlist-box-img">
                    {/* <img src={pic} alt="" /> */}
                    <ImgSquare
                    Thumbnail = {props.Thumbnail}
                    />
                </div>
                <div className="navbar-playlist-box-name">
                    <h4>{props.PlaylistName}</h4>
                </div>
            </button>
        }
        </>

    )
}