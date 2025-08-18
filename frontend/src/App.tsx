
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import {store} from './store/index'
import { SnackbarProvider } from "notistack";
const App= () => {
  return (
    <Provider store={store}>
 <SnackbarProvider maxSnack={3}>

    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
 </SnackbarProvider>
    </Provider>
  );
};

export default App;