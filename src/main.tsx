
import ReactDOM from "react-dom/client";
import App from './App.tsx'
import './App.css'; 
import AppProvider from "./context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
