"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { STR, type Lang, type Strings } from "./strings";

type Ctx = { lang: Lang; L: Strings; toggleLang: () => void };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    try {
      if (localStorage.getItem("tms-lang") === "en") setLang("en");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const n: Lang = l === "en" ? "fr" : "en";
      try {
        localStorage.setItem("tms-lang", n);
      } catch {}
      return n;
    });
  }, []);

  return <LangContext.Provider value={{ lang, L: STR[lang], toggleLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error("useLang must be used inside LangProvider");
  return c;
}
