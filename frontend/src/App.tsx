import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PendulumControls from "./components/PendulumControls";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <div className="main-content">
          <aside className="sidebar">
            {[3001, 3002, 3003, 3004, 3005].map((port) => (
              <PendulumControls key={port} backendPort={port} />
            ))}
          </aside>
          <main className="main">
            <AppRoutes />
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
