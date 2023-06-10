import './sliderMain.css'
import {useEffect, useState} from 'react'
import { useRef } from 'react'
// import song from '../../assets/Suncrown - Legend of the Forgotten Centuries.mp3'
import Slider from '../../components/slider/Slider'

function SliderMain(props){

    const [percentage, setPercentage] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
  
    const audioRef = useRef()
    useEffect(()=>{
      setPercentage(0)
      setCurrentTime(0)
    },[props.song])
    const onChange = (e) => {
      const audio = audioRef.current
      audio.currentTime = (audio.duration / 100) * e.target.value
      console.log(e)
      setPercentage(e.target.value)
    }
    
    const [savePlayerData,setPlayerData]=useState(false)


    const play = () => {
      const audio = audioRef.current
      audio.volume = 1
  
      if (!isPlaying) {
        setIsPlaying(true)
        audio.play()
      }
  
      if (isPlaying) {
        setIsPlaying(false)
        audio.pause()
      }
    }
  
    if(savePlayerData !== props.Play){ 
        play()
        setPlayerData(!savePlayerData)
    }

    const getCurrDuration = (e) => {
      const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
      const time = e.currentTarget.currentTime
  
      setPercentage(+percent)
      setCurrentTime(time.toFixed(2))
    }



    //======================================
    //COUNTER

    function secondsToHms(seconds) {
        if (!seconds) return '00:00'
    
        let duration = seconds
        let hours = duration / 3600
        duration = duration % 3600
    
        let min = parseInt(duration / 60)
        duration = duration % 60
    
        let sec = parseInt(duration)
    
        if (sec < 10) {
          sec = `0${sec}`
        }
        if (min < 10) {
          min = `0${min}`
        }
    
        if (parseInt(hours, 10) > 0) {
          return `${parseInt(hours, 10)}h ${min}${sec}`
        } else if (min === 0) {
          return `00:${sec}`
        } else {
          return `${min}:${sec}`
        }
      }


    //======================================
    return(
        
            <div className="slider-main-wrapper-section">
                <div className="slider-main-time-section">
                    <h6>{secondsToHms(currentTime)}</h6>
                </div>
                <div className="slider-main-slider-section">
                    {/* ============================== */}
                    <Slider percentage={percentage} onChange={onChange} Position={0}/>
                    <audio
                        ref={audioRef}
                        onTimeUpdate={getCurrDuration}
                        onLoadedData={(e) => {
                        setDuration(e.currentTarget.duration.toFixed(2))
                        }}
                        src={props.song}
                    ></audio>
                    {/* ================================== */}
                </div>
                <div className="slider-main-time-section">
                    <h6>{secondsToHms(duration)}</h6>
                </div>       
            </div>
    )
}
export default SliderMain