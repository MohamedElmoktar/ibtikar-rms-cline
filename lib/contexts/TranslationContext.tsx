import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { translate, Locale, Namespace } from "../translations";

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: Namespace, key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    // Get locale from URL path or default to French
    const pathLocale = router.asPath.split("/")[1] as Locale;
    if (["ar", "fr", "en"].includes(pathLocale)) {
      setLocale(pathLocale);
    } else {
      setLocale("fr");
    }
  }, [router.asPath]);

  const t = (namespace: Namespace, key: string): string => {
    return translate(locale, namespace, key);
  };

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // Update URL to include locale
    const currentPath = router.asPath;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <TranslationContext.Provider
      value={{ locale, setLocale: handleSetLocale, t }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(namespace: Namespace) {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return {
    t: (key: string) => context.t(namespace, key),
    locale: context.locale,
    setLocale: context.setLocale,
  };
}
