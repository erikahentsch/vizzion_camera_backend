const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch')
var parser = require('xml2js');
const path = require('path')

require('dotenv').config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());

app.get('/test', (res,req)=> {
    res.json([]);
});

app.get('/api', function (req, res) {
    const url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=-79.439&dblMaxLongitude=-79.324&dblMinLatitude=43.613&dblMaxLatitude=43.681&strRoadNames=&intOptions=0`
    fetch(`${url}&strPassword=ZUY%5b%5bBB%5cB3%5bWSVBBIJIQZHU%26IFEO`)
      .then(response=>response.text())
      .then(body=>{
        parser.parseString(body, (err, result)=>{
            let parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Cameras;
            let cameraData = []
            parsedData.map(camera=>{
                let tempObject = {}
                tempObject['id'] = camera.CameraID[0];
                tempObject['name'] = camera.Name[0];
                tempObject['lat'] = camera.Latitude[0];
                tempObject['long'] = camera.Longitude[0];
                if (camera.Hotspot) {
                    tempObject['hotspot'] = true;
                } else {
                    tempObject['hotspot'] = false;
                }
                cameraData.push(tempObject)
            });

            res.send(cameraData)
        });
      });
});

app.use('', express.static('public'));
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


app.get("/static", (req, res)=> {
    res.send('/camera.png')
})

app.get("/image/:id", (req, res)=> {
    let imgUrl = `http://www.vizzion.com/TrafficCamsService/TrafficCams.ashx?strRequest=GetCameraImage7&intCameraID=${req.params.id}&intDesiredWidth=720&intDesiredHeight=480&intDesiredDepth=8&intOptions=0&strPassword=ZUY%5b%5bBB%5cB3%5bWSVBBIJIQZHU%26IFEO`
    
    let img = `<img src=${imgUrl} />`

    // fetch(imgUrl)
    //     .then(response=>{
    //         console.log(response.status)
    //         if (response.status === 200) {
    //             res.send(img) 
    //         } else {
    //             // res.send("/operator_intervention_a.jpg")
    //         }
    //     });
    res.send('http://www.vizzion.com/TrafficCamsService/TrafficCams.ashx?strRequest=GetCameraImage7&intCameraID=${req.params.id}&intDesiredWidth=720&intDesiredHeight=480&intDesiredDepth=8&intOptions=0&strPassword=ZUY%5b%5bBB%5cB3%5bWSVBBIJIQZHU%26IFEO')
})

function notFound(req,res,next) {
    res.status(404);
    const error= new error('Not Found');
    next(error);
};

function errorHandler(error, req,res,next) {
    res.status(res.statusCode || 500);
    res.json({
        message: error.message
    });
};

// app.use(notFound);
// app.use(errorHandler);
//   All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  })

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log('Listening on port ', port)
})





// const cors = require('cors');
// const path = require('path');
// const fetch = require('node-fetch');

// const isDev = process.env.NODE_ENV !== 'production';
// const PORT = process.env.PORT || 5000;

// require('dotenv').config()

// const app = express()

// app.use(cors)
//   // Priority serve any static files.
// // app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// // function notFound(req,res,next) {
// //   res.status(404);
// //   const error = new Error('Not Found')
// //   next(error)
// // }

// // function errorHandler(error,req,res,next) {
// //   res.status(res.statusCode);
// //   res.json({
// //     message: error.message
// //   })
// // }

// // app.use(notFound);
// // app.use(errorHandler);
// //   // Answer API requests.

// app.get

//   app.get('/', function (req, res) {
//   const url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=-79.439&dblMaxLongitude=-79.324&dblMinLatitude=43.613&dblMaxLatitude=43.681&strRoadNames=&intOptions=0`
//   // fetch(`https://elector.blcloud.net/api/party/?json=true`)
//   //   .then(response=>response.json())
//   //   .then(json=>{
//   //     res.json(json)
//   //   })
//   res.send("hi")
// });



//   // All remaining requests return the React app, so it can handle routing.
// // app.get('*', function(request, response) {
// //     response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
// //   });

// app.listen(PORT, () => {
//   console.log('listening on port', PORT)  
// });

