import { Provider } from "react-redux";
import { DesignSystemProvider } from "./design/DesignSystemProvider";
import { SongLibraryWorkspace } from "./features/songs/SongLibraryWorkspace";
import { store } from "./store/store";

export const AppContent = () => <SongLibraryWorkspace />;

export const App = () => (
  <DesignSystemProvider>
    <Provider store={store}>
      <AppContent />
    </Provider>
  </DesignSystemProvider>
);
