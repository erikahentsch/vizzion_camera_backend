import React, { useState, useEffect } from 'react';
import Map from './components/Map'

import './App.css';

    let pt1 = [43.613, -79.439];
    let pt2 = [43.681, -79.324];



const App = () => {
  const [data, setData] = useState(null)
  const [loading, toggleLoading] = useState(true)
	const [rectangle, setRectangle] = useState([pt1, pt2])
	const [error, toggleError] = useState(null)
  
    useEffect(()=>{
      getData()
    }, [])

    const getData = () => {
      console.log("get Data")
      fetch('api')
        .then(res=>{
          if (res.ok){
            return res.json()
          }
        })
        .then(json=>{
          // console.log(json);  
          let dataObject = []
          setData(json)
        })
    }

    const updateRectangle = (rect) => {
      console.log("App", rect)
      toggleLoading(true)
      toggleError(null)
      setRectangle(rect)
      setData(null)
      getData(rect[0], rect[1])
    }
  
  
    const handleReset = () => {
      toggleError(null)
    }

    return (
      <div className="App" >
        <Map 
          error={error}
          handleReset={handleReset}
          searchArea={rectangle}
          // config={config.config} 
          loading={loading} 
          cameras={data} 
          handleNewRectangle={updateRectangle}
				/>
      </div>
    );
}

export default App;
