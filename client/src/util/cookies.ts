

function getCookie(name: string): string {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(";").shift();
    return cookieValue ? cookieValue : "";
  }
  return "";
}

let _locale: any;
export function getLocaleFromCookie(): string {
  if (!_locale) {
    const cookieValue = unescape(getCookie("origamCurrentLocale"));
    const pattern = /c=([a-zA-Z-]+)\|/i;
    const results = cookieValue.match(pattern);
    _locale = results ? results[1] : "cs-CZ";
  }
  return _locale;
}

