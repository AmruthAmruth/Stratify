import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import "./App.css";

const App = () => { 


  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
