import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return (
    <SessionProvider session={session}>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </SessionProvider>
  );
}

export default App;
