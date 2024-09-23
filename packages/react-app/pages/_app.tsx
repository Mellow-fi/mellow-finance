import type { AppProps } from "next/app";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "@/components/Login";
import PoolList from "@/components/PoolList";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pool-list" element={<PoolList />} /> {/* Handle after login here */}
      </Routes>
    </Router>
  );
}

export default App;






