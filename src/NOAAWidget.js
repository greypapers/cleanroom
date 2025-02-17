import { h, render, useSignal, htm, useEffect, useRef, useState, useReducer  } from "../lib/standalone.js";


// Initialize htm with Preact
const html = htm.bind(h);


// write a post to the weather_update endpoint
const weatherUpdate = async (data) => {
  const response = await fetch("/weather_update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();

}

const NOAAWidget = (props) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      fetch(
        "https://api.weather.gov/points/" +
          position.coords.latitude +
          "," +
          position.coords.longitude
      )
        .then((response) => response.json())
        .then((data) => {
          
          const radar_img_src =
            "https://radar.weather.gov/ridge/standard/" +
            data.properties.radarStation +
            "_loop.gif";
          const city = data.properties.relativeLocation.properties.city;
          const url = data.properties.forecastHourly;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {

              let weather_data = {
                radar: radar_img_src,
                city: city,
                forecast: data.properties.periods[0],
              };

              weatherUpdate({"ok": ["ok"], weather: [weather_data]})
              .then((data) => { 
                console.log(typeof data);
                console.log(data);
                let z = JSON.parse(data.data);
                console.log(z[0]);
              })
 

              setWeatherData(weather_data);
            });
        });
    }
  }, []);

 useEffect(() => {
    if (weatherData && imgRef.current) {
      
      let radar_img = document.createElement("img");
      radar_img.src = weatherData.radar;
      

      // write an inline turnary statement
     

      props.smol ? radar_img.style.width = "50px" : radar_img.style.height = "350px";
      // Clear any previous content from the imgRef
      imgRef.current.innerHTML = "";

      // Mount the image to the ref
      imgRef.current.appendChild(radar_img);
    }
  }, [weatherData]);
  let content;
  if (weatherData) {
    content = html`<div className="box" style="max-width: 300px;">
      <div style="margin: .5em;" />
      <h4 className="small-caps">${props.title} </h4>
      <div ref=${imgRef}></div>
      <h3>${weatherData.forecast.temperature}°</h3>
      <pre>${weatherData.city}</pre>
      <pre>${weatherData.forecast.shortForecast}</pre>
      
      
    </div>`;
  } else {
    content = html`<div className="box" style="max-height:150px">  
      <img class="loading" src="/static/loading.gif"/>

    </div>`;
  }
  return content;
};

export default NOAAWidget;
