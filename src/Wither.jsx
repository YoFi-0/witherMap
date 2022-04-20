import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Wither.css'
import { Wrapper, Status} from "@googlemaps/react-wrapper";
import axios from 'axios'
//city name
//pk.3206da922945e051dd3db9c51b30bd47
//https://us1.locationiq.com/v1/reverse.php?key=pk.3206da922945e051dd3db9c51b30bd47&lat=22.67484735118852&lon=41.748046875&format=json
//google
//AIzaSyD06wmLNQ8GuC9Pj-o8DjNEO1QYcr6LD9c
//wither
//https://api.weatherapi.com/v1/current.json?key=ccdd0b7860b946529de120112221204&q=city&aqi=yes
const apiKeys = {
  locationiq: 'pk.3206da922945e051dd3db9c51b30bd47',
  google: 'AIzaSyD06wmLNQ8GuC9Pj-o8DjNEO1QYcr6LD9c',
  weatherapi: 'ccdd0b7860b946529de120112221204'
}

function Wither(){

  const [clicks, setClicks] = useState([])
  const [getLocation, chanegLocatione] = useState()
  const [getWither, changeWither] = useState()
  const [isLoading, changeIsLoading] = useState('none')
  const faris = useRef()

  const render = (status) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return 'lala'
  };
  const getCityData = async(lat, lng) =>{
    try{
      await axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${apiKeys.locationiq}&lat=${lat}&lon=${lng}&format=json`).then(res=>{
        chanegLocatione(res.data)
      }).catch(err=>{
        changeIsLoading('err')
        faris.current.style = 'transForm: translateX(0)'
        console.log(isLoading)
      })
    } catch(err){
      changeIsLoading('err')
      faris.current.style = 'transForm: translateX(0)'
      console.log
    }
  }
  const lolo = (e) =>{
    changeIsLoading(true)
    setClicks([e.latLng])
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    console.log(`lat: ${lat}`)
    console.log(`lng: ${lng}`)
    getCityData(lat, lng)
    faris.current.style = 'transForm: translateX(-200px)'
  }
  useEffect(async()=>{
    var url = ''
    if(getLocation !== undefined){
      if(getLocation.address.state){
        try{
            url = `https://api.weatherapi.com/v1/current.json?key=${apiKeys.weatherapi}&q=${getLocation.address.state}&aqi=yes`
              await axios.get(url).then(res=>{
                changeWither(res.data)
                console.log(getLocation)
              })
        } catch(err){
          changeIsLoading('err')
          faris.current.style = 'transForm: translateX(0)'
        }
      } else {
        console.log(getLocation)
      }
    }
  }, [getLocation])
  useEffect(()=>{
    changeIsLoading(isLoading == 'none'? 'none': false)
    faris.current.style = 'transForm: translateX(0)'
  }, [getWither])
  const center = { lat: 0, lng: 0 };
  const zoom = 3;

  return (
    <div className='app'>
      <div className='dataDisplay'>
        {(()=>{
          if(isLoading == 'none') {
            return <div ref={faris} className='respons'>
              <p className='startPiont'>tap a city to show the wither status</p>
            </div>
          } else if (isLoading == 'err'){
            return <div ref={faris} className='respons'>
               <p className='reErr'>connot take wither</p>
               <p className='reErr'>from that position</p>
            </div>
          } else if (isLoading){
            return <React.Fragment>
              <div ref={faris} className='respons'></div>
              <div className='fatherLodingAnimation'>
                <div className='loadingAnimation lodingOne'></div>
                <div className='loadingAnimation lodingtow'></div>
                <div className='loadingAnimation lodingthree'></div>
              </div>
              
            </React.Fragment>
             
          } else {
            return (
              <div ref={faris} className='respons'>
                <p className='cityName'>{getWither? `${getWither.location.region},`: ''}{getWither? getWither.location.name: ''}</p>
                <img className='imageWither' src={getWither? getWither.current.condition.icon: ''}/>
                <p className='witherState'>{getWither? getWither.current.condition.text: ''}</p>
              </div>
            )
          }
        })()}
      </div>
      <Wrapper apiKey={apiKeys.google} render={render}>
        <MapComp onClick={lolo} center={center} zoom={zoom}>
          {clicks.map((xAndy, eKey)=>{
            return <Mark key={eKey}  position={xAndy}/>
          })}
        </MapComp>
      </Wrapper>
      </div>
  )
}

function MapComp({center, zoom, children, onClick}) {
  const [map, setMap] = React.useState();
  const mapRef = useRef()

  useEffect(()=>{
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, {center, zoom}))
    }
  }, [mapRef, map])

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }
    }
  }, [map, onClick]);

  const style = {width: '80%'}
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("div", { ref: mapRef, style: style}),
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { map });
      }
    })
  );
  

}

function Mark(options){
  const [marker, setMark] = useState()
  
  useEffect(()=>{
    if(!marker){
      setMark(new window.google.maps.Marker())
    }
    if(marker){
      marker.setOptions(options)
    }
    return () =>{
      if(marker){
        marker.setMap(null)
      }
    }
  }, [marker, options])
  return null
}
export default Wither

// import React, { useEffect, useRef, useState } from 'react'
// function CountInputChanges() {
//   // const [zozo, papa] = useState([])
//   // const jsutLala = useRef()
//   // const  xxx = () =>{
//   //   papa([{data: '1', doto: '2'}, {data: '3', doto: '4'}, {data: '5', doto: '6'},])
//   // }
//   // return(
//   //   <React.Fragment>
//   //     <button onClick={xxx} >coco</button>
//   //     {zozo.map((value, index)=>{
//   //       <div key={index} onClick={xxx}>
//   //         {value.data}
//   //       </div>
//   //     })}
//   //   </React.Fragment>
//   // )


//   // const [value, setValue] = useState('');
//   // const [count, setCount] = useState(-1);
//   // useEffect(() => setCount(count + 1));
//   // const onChange = ({ target }) => setValue(target.value);
//   // return (
//   //   <div>
//   //     <input type="text" value={value} onChange={onChange} />
//   //     <div>Number of changes: {count}</div>
//   //   </div>
//   // )
// }
// export default CountInputChanges

