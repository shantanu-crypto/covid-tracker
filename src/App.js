import React ,{useState,useEffect} from 'react';
import './App.css';
import Infobox from './components/Infobox';
import Map from './components/Map';
import {FormControl,Card,
  Select,
  MenuItem,CardContent
} from  '@material-ui/core'
import Table from './components/Table'
import { sortData } from './components/util';
import Linegraph from './components/Linegraph'
import Graph from './components/Graph';

function App() {

  
  const [countries,setCountries]=useState([])
  
  const [country,setCountry]=useState('worldwide')
  const [countryInfo,setCountryInfo]=useState({})
  const [tableData,setTableData]=useState({})
  const [casesType] = useState("cases");

  useEffect(()=>{

    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
  .then((response)=>response.json())
  .then((data)=>{
    
    const countries = data.map((country)=>(
      {
        name:country.country,
        value:country.countryInfo.iso2
      }
    ))
    const sortedData =sortData(data);
  
    setTableData(sortedData);
    setCountries(countries)
  })

}
getCountriesData()

  },[])


  useEffect(()=>{

   fetch("https://disease.sh/v3/covid-19/all")
   .then(response=>response.json())
   .then((data)=>{
    setCountryInfo(data);
    
   })

  },[])

  const onCountryChange=async(event)=>{
    const countryCode=event.target.value;
 

    const url=countryCode==='worldwide'?"https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response=>response.json())
    .then((data)=>{
     console.log(data)
      setCountry(countryCode);
     setCountryInfo(data);
     
    })
  }
  
  
  return (
    <div className="app_yo">
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>Covid-19 tracker</h1>
      <FormControl className="app_dropdown">
        <h4         style={{color:"white"}}>Change country</h4>
        <Select
        varient="outlined"
        value={country}
        onChange={onCountryChange}
        style={{color:"white",font:"5em"}}
        >
          <MenuItem value="worldwide">WorldWide</MenuItem>
          {countries.map((country)=>(
            <MenuItem value={country.value} >{country.name}</MenuItem>
          ))}

        </Select>

      </FormControl>
      </div>
      <div className="app__stats_con">
      <div className="app__stats">
        <Infobox  title="Coronavirus Cases" isRed active={casesType === "cases"} cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <Infobox    title="Recovered" active={casesType === "recovered"} cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
        <Infobox   title="Deaths" isRed active={casesType === "deaths"} cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        

      </div>
      <h1 style={{color:"red",textAlign:'center',padding:"20px"}}>Per One Million</h1>
       <div className="app__stats1">
       
        <Infobox title="Tests" cases={countryInfo.testsPerOneMillion} total={countryInfo.tests}/>
        <Infobox title=" Cases" isRed active={casesType === "cases1"}   cases={countryInfo.casesPerOneMillion} />
        <Infobox    title="Active" isRed active={casesType === "Active"}  cases={countryInfo.activePerOneMillion} />
        <Infobox  title=" Critical" isRed active={casesType === "Critical"} cases={countryInfo.criticalPerOneMillion} />
        <Infobox title="Recovered"  cases={countryInfo.recoveredPerOneMillion} />


      </div>
      
      
      </div>
      <Map/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new Cases</h3>
          <Linegraph/>
        </CardContent>

      </Card>
          
    </div>
    
           <Graph/>
        
    </div>
  );
}

export default App;
