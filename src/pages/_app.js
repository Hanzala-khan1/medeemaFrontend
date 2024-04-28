import { interceptorConfig } from "@/services/config";
import "@/styles/globals.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();
  useEffect(() => {
    interceptorConfig(store.dispatch);
    // configureNotification();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
