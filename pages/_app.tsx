import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import "../styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig as any);
