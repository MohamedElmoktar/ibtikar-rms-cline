import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { TranslationProvider } from "../lib/contexts/TranslationContext";
import "../styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <TranslationProvider>
        <Component {...pageProps} />
      </TranslationProvider>
    </SessionProvider>
  );
}

export default App;
