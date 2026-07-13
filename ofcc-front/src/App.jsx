import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Ordens from "./pages/Ordens";
import Pecas from "./pages/Pecas";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ordens" element={<Ordens />} />
        <Route path="/pecas" element={<Pecas />} />
      </Routes>
    </>
  );
}

export default App;
