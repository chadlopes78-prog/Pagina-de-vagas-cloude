import { FINAL_CTA_APPEND_PARAMS, FINAL_CTA_URL, PREVIEW_MODE } from '../config';
import type { QuizAnswers } from './types';

export function isCtaConfigured(): boolean {
  return FINAL_CTA_URL.length > 0;
}

/** Monta o URL final (com parâmetros opcionais). */
export function buildFinalCtaUrl(answers: QuizAnswers, baseUrl: string = FINAL_CTA_URL): string {
  if (!baseUrl) return '';
  if (!FINAL_CTA_APPEND_PARAMS) return baseUrl;
  try {
    const url = new URL(baseUrl, window.location.href);
    if (answers.score !== null) url.searchParams.set('score', answers.score.toFixed(1));
    if (answers.province) url.searchParams.set('province', answers.province);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/** Redireciona para o checkout. Devolve false se o URL não estiver configurado. */
export function goToFinalCta(answers: QuizAnswers): boolean {
  const url = buildFinalCtaUrl(answers);
  if (!url) {
    console.warn('[Quiz] FINAL_CTA_URL não está configurado. Defina VITE_FINAL_CTA_URL ou edite src/config.ts.');
    return false;
  }
  // Na preview (dentro de uma moldura) o checkout abre num novo separador.
  if (PREVIEW_MODE) {
    const tab = window.open(url, '_blank');
    if (tab) {
      tab.opener = null;
      return true;
    }
  }
  window.location.assign(url);
  return true;
}
