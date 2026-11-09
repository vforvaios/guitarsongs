// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import "./tailwind.css";
import "./styles/colors.scss";
import "./index.css";
import "./styles/modal.scss";
import "./styles/admin.scss";
import "./styles/table.scss";

import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store from "./store";
import { AuthProvider } from "./context/AuthContext";

const persistor = persistStore(store);

// document.addEventListener("visibilitychange", function () {
//   if (document.visibilityState === "visible") {
//     console.log("APP resumed");
//     window.location.reload();
//   }
// });

createRoot(document.getElementById("root") as HTMLElement).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PersistGate>
  </Provider>,
  // </StrictMode>
);
