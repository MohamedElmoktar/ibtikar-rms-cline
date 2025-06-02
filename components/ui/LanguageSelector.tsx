import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { GlobeAltIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
];

export default function LanguageSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: languageCode });
    setIsOpen(false);
  };

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        dir="ltr"
        aria-label="Change language"
      >
        <GlobeAltIcon className="h-4 w-4 text-gray-600" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline font-medium text-gray-700">
          {currentLanguage.name}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center space-x-3 transition-colors ${
                router.locale === language.code
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
              dir="ltr"
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium flex-1" dir={language.dir}>
                {language.name}
              </span>
              {router.locale === language.code && (
                <span className="text-blue-600 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
