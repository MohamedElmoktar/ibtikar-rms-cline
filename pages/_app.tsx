import type { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../lib/trpc/client";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
