import { EUR_TO_MZN_RATE } from '../config';

/** Converte euros em meticais com a taxa configurada (EUR_TO_MZN_RATE). */
export function eurToMzn(eur: number, rate: number = EUR_TO_MZN_RATE): number {
  return Math.round(eur * rate);
}

/** 74000 → "74.000" (independente do locale do dispositivo). */
function groupThousands(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatEur(value: number): string {
  return `€${groupThousands(value)}`;
}

/** Arredonda à centena: 66 600 → "66.600 MT". */
export function formatMzn(value: number): string {
  return `${groupThousands(Math.round(value / 100) * 100)} MT`;
}
