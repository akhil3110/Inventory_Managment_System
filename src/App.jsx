import Home from "./components/Home/Home"
import Login from "./components/Login/Login"

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
   <>
   
    <BrowserRouter>
      <Routes>
        {localStorage.getItem("token") ? <Route path="/" element={<Home/>}/> : <Route path="/" element={<Login/>}/>}
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
   </>
  )
}

export default App
