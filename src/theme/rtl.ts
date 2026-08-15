import { Lang } from '../i18n/strings';

/** Row direction helper: the whole app is Arabic/RTL by default, with partial EN/LTR support
 * toggled from Settings (see README "Bilingual UI" section). We don't use RN's global
 * I18nManager.forceRTL (that requires a reload and affects native chrome); instead each
 * screen flips flexDirection locally based on the current language. */
export function rowDir(lang: Lang): 'row' | 'row-reverse' {
  return lang === 'ar' ? 'row-reverse' : 'row';
}

export function textAlign(lang: Lang): 'right' | 'left' {
  return lang === 'ar' ? 'right' : 'left';
}
