import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { DesignSystemProvider } from "./design/DesignSystemProvider";
import { store } from "./store/store";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <DesignSystemProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </DesignSystemProvider>
  </StrictMode>
);
