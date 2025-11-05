import {Routes, Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import DogDetail from "./components/DogDetail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dogs/:id" element={<DogDetail/>} />
    </Routes>
  );
}

export default App