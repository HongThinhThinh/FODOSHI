import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "aos/dist/aos.css";
import { StateProvider } from "./context/stateProvider";
import "./index.scss";
import { ConfigProvider } from "antd";
import { theme } from "./config/antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// AOS.init({
//   // initialise with other settings
//   duration: 1000,
// });
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StateProvider>
                <RouterProvider router={router} />
              </StateProvider>
            </PersistGate>
          </Provider>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
