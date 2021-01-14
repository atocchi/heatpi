import Axios from 'axios';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useState,useEffect} from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import Logo from './images/logo192.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function App() {

  const [status,setStatus] = useState(false);
  const [enable, setEnable] =useState(true);
  const [time, setTime] =useState(0);
 
  const [hms, setHMS] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  //get status of the switch (false is off true is on)
  useEffect(()=>{
    Axios(ip).then(function (res){
      setStatus(res.data.bool)
      setTime(res.data.date)
      console.log(status)
    })
  },[status])
 //submit function with axios
 function power(){
   let data = {post: status}
   Axios.post(ip, data).then(function (res){
    console.log(res.data)
    setStatus(res.data)
   })
 }

 function timer(x){
  setTime(x);
  let data = {seconds: x};
  Axios.post(ip,data)
  console.log('timer')
  let timex = x
  //interval within function to be cleared
  let timing = setInterval(function(){
  timex = timex -1
  setTime(timex)
  //hour minute seconds
  let hours = Math.floor(timex/3600)
  let minutes = Math.floor((timex - (hours * 3600))/60)
  let seconds = (timex - ((hours * 3600) + (minutes * 60)))
  setHMS({hours: hours, minutes: minutes, seconds: seconds})
  if(timex == 0){
    console.log('cleared')
    clearInterval(timing)
  }
  console.log(timex);
  },1000 )
}
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }} >
          <Typography variant="h1" component="h2" gutterBottom>
            HeatPi
          </Typography>
          <div style={{marginBottom: '10px'}}>
            <img src={Logo} />
          </div>
          <Switch label='power' size="large" checked={status} onChange={power} />
          <ButtonGroup  variant="contained" color="primary" aria-label="contained primary button group">
            <Button disabled={enable}>Clear</Button>
            <Button onClick={()=>timer(7200)}>2hrs</Button>
            <Button onClick={()=>timer(14400)}>4hrs</Button>
            <Button onClick={()=>timer(28800)}>8hrs</Button>
          </ButtonGroup>
          <br></br>
          <Typography variant="h2" component="h2" gutterBottom>
            {hms.hours} : {hms.minutes <= 9 ? '0': ''}{hms.minutes} : {hms.seconds <= 9 ? '0': ''}{hms.seconds}
          </Typography>
        </Typography>
      </Container>
    </div>
  );
}

export default App;
