import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import "./App.css";
import NotificationListener from "./shared/socket/NotificationListener";

const App = () => { 

     return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
      <NotificationListener/>
        <AppRoutes />
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;