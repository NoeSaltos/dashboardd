// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
{/* Hooks */ }
import { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid2";
import "./App.css";

import IndicatorWeather from "./components/IndicatorWeather";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import IndicatorGeneral from "./components/IndicatorGeneral";
import Item from './interface/Item';
import ItemChart from './interface/ItemChart';
import DataGeneral from './interface/DataGeneral';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  const [selectedVariable, setSelectedVariable] = useState<string>('precipitation'); // Estado global de la variable seleccionada
  let [chartItems, setChartItems] = useState<ItemChart[]>([]) //Grafico
  let [items, setItems] = useState<Item[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  const [weatherData, setWeatherData] = useState<DataGeneral | null>(null);

  {/* Hook: useEffect */ }
  useEffect(() => {

    let request = async () => {

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {

        {/* Request */ }
        let API_KEY = "4926847d1a116d6ea414ff979440b2d6"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();

        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      {/* Valide el procesamiento con el valor de savedTextXML */ }
      if (savedTextXML) {

        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }

        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let dataToItems: Item[] = [];
        let dataForChart: ItemChart[] = [];

        //Datos para el Indicador General---------------------------
        let city = xml.getElementsByTagName("name")[0]?.textContent || "";
        let country = xml.getElementsByTagName("country")[0]?.textContent || "";
        let temperatureValue = xml.querySelector("temperature")?.getAttribute("value") || "";
        let feelsLikeValue = xml.querySelector("feels_like")?.getAttribute("value") || "";
        let symbolVar = xml.querySelector("symbol")?.getAttribute("name") || "N/A";
        let symbolImg = xml.querySelector("symbol")?.getAttribute("var") || "N/A";
        let conditionUrl = symbolVar ? `https://openweathermap.org/img/wn/${symbolImg}.png` : "";

        const temperatureCelsius = Math.round(parseFloat(temperatureValue) - 273.15).toString();
        const feelsLikeCelsius = Math.round(parseFloat(feelsLikeValue) - 273.15);


        setWeatherData({
          city: `${city}, ${country}`,
          date: new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
          temperature: temperatureCelsius.toString(), // Convertir a string
          minTemperature: (parseFloat(temperatureCelsius) - 2).toFixed(2),
          description: symbolVar,
          imagen:conditionUrl,
          feelsLike: feelsLikeCelsius.toString(), 
        });
        
        

        //----------------------------------------------------------
        {/* 
             Análisis, extracción y almacenamiento del contenido del XML 
             en el arreglo de resultados
         */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        console.log(dataToIndicators)

           {/* Procesamiento de etiquetas <time> */}
         let timeNodes = xml.getElementsByTagName("time");

         for (let i = 0; i < Math.min(5, timeNodes.length); i++) {
           let timeNode = timeNodes[i];

           // Obtener atributos y valores de etiquetas hijas
           let from = timeNode.getAttribute("from") || "";
           let to = timeNode.getAttribute("to") || "";
           let precipitationProbability = timeNode.querySelector("precipitation")?.getAttribute("probability") || "N/A";
          let humidityValue = timeNode.querySelector("humidity")?.getAttribute("value") || "N/A";
          let temperatureValue = timeNode.querySelector("temperature")?.getAttribute("value")|| "N/A";
          let temperatureCelsius = temperatureValue 
  ? `${(parseFloat(temperatureValue) - 273.15).toFixed(2)} °C` 
  : "Temperatura no disponible";
           let cloudsValue = timeNode.querySelector("clouds")?.getAttribute("all") || "N/A";
          // Obtener el atributo "var" del elemento symbol
  let symbolVar = timeNode.querySelector("symbol")?.getAttribute("var") || "";


  // Construir la URL del ícono (ejemplo basado en OpenWeatherMap)
  let conditionUrl = symbolVar ? `https://openweathermap.org/img/wn/${symbolVar}.png` : "";


           // Agregar datos al arreglo temporal
           dataToItems.push({
            dateStart: from.split("T")[0], // Obtiene solo la fecha
            timeStart: from.split("T")[1], // Obtiene solo la hora
            dateEnd: to.split("T")[0], // Obtiene solo la fecha
            timeEnd: to.split("T")[1], // Obtiene solo la hora
            precipitation: precipitationProbability,
            humidity: humidityValue,
            clouds: cloudsValue,
            temperature: temperatureCelsius,
            condition: conditionUrl,
            
        });

         }

         // **Segundo bucle**: Todos los datos para el gráfico
        for (let i = 0; i < timeNodes.length; i++) {
          let timeNode = timeNodes[i];
          let from = timeNode.getAttribute("from") || "";
          let precipitationProbability = timeNode.querySelector("precipitation")?.getAttribute("probability") || "N/A";
          let humidityValue = timeNode.querySelector("humidity")?.getAttribute("value") || "N/A";
          let cloudsValue = timeNode.querySelector("clouds")?.getAttribute("all") || "N/A";

          dataForChart.push({
              dateS: from.split("T")[0], // Fecha
              precipitation: precipitationProbability,
            humidity: humidityValue,
            clouds: cloudsValue,
          });
      }



        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators)
        setItems(dataToItems);
        setChartItems(dataForChart);  // Datos para el gráfico (todos los nodos)
        

      }

    }

    request();

  }, [owm])

 



  let renderIndicators = () => {

    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, md: 6, xl: 6 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )
  }

  //----------------------GRAFICO----------------------------

  // Función para actualizar la variable seleccionada
  const handleVariableChange = (variable: string) => {
    setSelectedVariable(variable);
};

// Función para calcular el promedio por día
const calculateDailyAverage = (data: ItemChart[], variable: string) => {
  const groupedData: { [date: string]: { sum: number; count: number } } = {};

  // Agrupar por fecha
  data.forEach((item) => {
      const date = item.dateS || ""; // Fecha
      const value = parseFloat(item[variable as keyof ItemChart]?.toString() || "0");

      if (!groupedData[date]) {
          groupedData[date] = { sum: value, count: 1 };
      } else {
          groupedData[date].sum += value;
          groupedData[date].count += 1;
      }
  });

  // Calcular promedio
  return Object.keys(groupedData).map((date) => ({
      date,
      average: groupedData[date].sum / groupedData[date].count,
  }));
};

console.log(calculateDailyAverage(items, selectedVariable));

//-------------------------------------------------------------

  {/* JSX */ }

  return (
    
    <div className="app-container">
      {/* Indicadores del clima */}
      {weatherData && (
        <IndicatorGeneral
          city={weatherData.city}
          date={weatherData.date}
          temperature={weatherData.temperature}
          minTemperature={weatherData.minTemperature}
          description={weatherData.description}
          imagen={weatherData.imagen}
          feelsLike={weatherData.feelsLike}
        />
      )}
    
    <Grid container spacing={5}>
      {/* Indicadores en dos columnas */}
    <Grid container size={{ xs: 12, md: 6, xl: 6 }} spacing={1}>
      {renderIndicators()}
    </Grid>

      {/* Tabla */}
      
        {/*  */}
        
        
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
          <TableWeather itemsIn={items} />
        </Grid>
        

      {/* Gráfico */}
      {/*  */}
      <Grid size={{ xs: 12, md: 12, xl: 12 }} container spacing={2}>
      <Grid size={{ xs: 12, md: 3, xl: 3 }}>
          <ControlWeather onVariableChange={handleVariableChange} />
        </Grid>
      <Grid size={{ xs: 12, md: 9, xl: 9 }}>
        <LineChartWeather data={calculateDailyAverage(chartItems, selectedVariable)} 
    variable={selectedVariable} />
      </Grid>
    </Grid>
    </Grid>
    </div>
  )
}

export default App;
