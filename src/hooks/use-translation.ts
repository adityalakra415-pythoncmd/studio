
"use client";

import { useLanguage } from "@/context/language-context";
import { staticText } from "@/lib/static-text";
import { useMemo } from "react";

function get(obj: any, path: string[], defaultValue: any = ''): any {
  if (!path || path.length === 0) {
    return obj;
  }
  const [key, ...rest] = path;
  const value = obj?.[key];
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'object' && value !== null && rest.length > 0) {
    return get(value, rest, defaultValue);
  }
  return value;
}

export function useTranslation() {
  const { translations, isTranslating } = useLanguage();

  const t = useMemo(() => {
    const createProxy = (path: string[] = []): any => {
      // This function will be the callable part of the proxy
      const fn = (key: string) => {
        const fullPath = [...path, ...key.split('.')];
        const translatedValue = get(translations, fullPath);
        const staticValue = get(staticText, fullPath);

        if (isTranslating) return '...';
        
        return translatedValue || staticValue || key;
      };

      return new Proxy(fn, {
        get(target, prop: string) {
          return createProxy([...path, prop]);
        }
      });
    };

    return createProxy();
  }, [translations, isTranslating]);

  return { t, isTranslating };
}
