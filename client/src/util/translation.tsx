import React from "react";
import axios from "axios";
import { getLocaleFromCookie } from "./cookies";
import { Observer } from "mobx-react";

const debugShowTranslations = !!window.localStorage.getItem(
  "debugShowTranslations"
);

let translations = {} as { [k: string]: string };

export async function translationsInit() {
  const locale = getLocaleFromCookie();
  translations = (await axios.get(`locale/localization_${locale}.json`, {}))
    .data;
}

export function T(defaultContent: any, translKey: string, ...p: any[]) {
  return (
    <Observer>
      {() => {
        let result;
        let showingDefault = false;
        if (translations.hasOwnProperty(translKey)) {
          result = translations[translKey];
        } else {
          result = defaultContent;
          showingDefault = true;
        }
        for (let i = 0; i < p.length; i++) {
          result = result.replace(`{${i}}`, p[i]);
        }
        if (debugShowTranslations) {
          if (showingDefault) {
            console.error(
              `Could not find translation for: "${translKey}", showing default: "${result}"`
            );
            result = (
              <span
                title={translKey}
                style={{ backgroundColor: "red", color: "white" }}
              >
                {result}
              </span>
            );
          } else {
            result = (
              <span
                title={translKey}
                style={{ backgroundColor: "green", color: "white" }}
              >
                {result}
              </span>
            );
          }
        }
        return <>{result}</>;
      }}
    </Observer>
  );
}

export function TR(defaultContent: any, translKey: string, ...p: any[]) {
  let result;
  let showingDefault = false;
  if (translations.hasOwnProperty(translKey)) {
    result = translations[translKey];
  } else {
    result = defaultContent;
    showingDefault = true;
  }
  for (let i = 0; i < p.length; i++) {
    result = result.replace(`{${i}}`, p[i]);
  }
  if (debugShowTranslations) {
    if (showingDefault) {
      console.error(
        `Could not find translation for: "${translKey}", showing default: "${result}"`
      );
      result = `T> !DEFAULT:${result} <T`;
    } else {
      result = `T> ${result} <T`;
    }
  }
  return result;
}
