/**
 * ============================================================
 *  CONFIGURAÇÃO DO FUNIL — edite apenas este ficheiro (ou o .env)
 * ============================================================
 */

const env = import.meta.env;

/**
 * URL FINAL DO CTA ("GARANTIR O MEU ESPAÇO AGORA").
 *
 * >>> COLOQUE AQUI O URL DO SEU CHECKOUT / PÁGINA FINAL <<<
 *
 * Pode definir directamente nesta constante ou, de preferência, através
 * da variável de ambiente VITE_FINAL_CTA_URL (ficheiro .env).
 * VITE_FINAL_CTA_URL, se definido, tem prioridade sobre o valor abaixo.
 */
export const FINAL_CTA_URL: string =
  (env.VITE_FINAL_CTA_URL as string | undefined)?.trim() || 'https://pay.lojou.app/lzf7x';

/**
 * Se true, acrescenta ao FINAL_CTA_URL os parâmetros ?score=..&province=..
 * (útil para o checkout/CRM saber de onde vem o lead). Nome nunca é enviado.
 */
export const FINAL_CTA_APPEND_PARAMS = false;

/**
 * VÍDEO DA ETAPA FINAL.
 *
 * >>> COLOQUE AQUI O URL DO VÍDEO <<<  (ou use VITE_VIDEO_URL no .env)
 *
 * Aceita:
 *  - YouTube:  https://www.youtube.com/watch?v=ID  ·  https://youtu.be/ID  ·  /shorts/ID
 *  - Vimeo:    https://vimeo.com/123456789
 *  - Ficheiro: https://.../video.mp4 (ou .webm, .mov, .m4v) — ou um ficheiro em public/, ex.: 'videos/vsl.mp4'
 *  - Outro player com link de incorporação (iframe): ex. https://player.exemplo.com/embed/abc
 * Vazio = mostra um placeholder elegante.
 *
 * Vídeo actual: public/videos/vsl.mp4 (720p, H.264/AAC, faststart).
 */
export const VIDEO_URL: string = (env.VITE_VIDEO_URL as string | undefined)?.trim() || 'videos/vsl.mp4';

/**
 * Versão alternativa do mesmo vídeo (WebM), usada só se o navegador não reproduzir o MP4.
 * Deixe vazio se não tiver uma.
 */
export const VIDEO_FALLBACK_URL: string =
  (env.VITE_VIDEO_FALLBACK_URL as string | undefined)?.trim() || 'videos/vsl.webm';

/** Imagem de capa opcional (usada em ficheiros de vídeo e no Vimeo/iframe antes de tocar). */
export const VIDEO_POSTER_URL: string =
  (env.VITE_VIDEO_POSTER_URL as string | undefined)?.trim() || 'videos/vsl-poster.jpg';

/** Proporção do vídeo: '16 / 9' (horizontal) ou '9 / 16' (vertical, estilo reels). */
export const VIDEO_ASPECT_RATIO: '16 / 9' | '9 / 16' | '4 / 5' | '1 / 1' = '16 / 9';

/**
 * Taxa de câmbio EUR → MZN usada APENAS para os exemplos ilustrativos de salário.
 * NÃO é uma taxa oficial. Actualize periodicamente (ou use VITE_EUR_TO_MZN_RATE).
 */
const DEFAULT_EUR_TO_MZN_RATE = 74;
const envRate = Number(env.VITE_EUR_TO_MZN_RATE);
export const EUR_TO_MZN_RATE: number = Number.isFinite(envRate) && envRate > 0 ? envRate : DEFAULT_EUR_TO_MZN_RATE;

/** Exemplos de remuneração mensal bruta (EUR) mostrados na etapa de salários. */
export const SALARY_EXAMPLES_EUR: readonly number[] = [900, 1000, 1200, 1500];

/** Currículo: tipos aceites e tamanho máximo. */
export const CV_ACCEPTED_EXTENSIONS: readonly string[] = ['pdf', 'doc', 'docx'];
export const CV_ACCEPTED_MIME_TYPES: readonly string[] = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const CV_MAX_SIZE_MB = 5;

/**
 * Endpoint opcional para enviar o currículo (POST multipart/form-data, campo "cv").
 * Vazio = o ficheiro é validado apenas no navegador e não sai do dispositivo.
 */
export const CV_UPLOAD_ENDPOINT: string = (env.VITE_CV_UPLOAD_ENDPOINT as string | undefined)?.trim() || '';

/** Idade aceite no formulário. */
export const MIN_AGE = 18;
export const MAX_AGE = 65;

/** Imagem da primeira tela. Substitua por uma fotografia (ex.: '/images/lisboa.jpg'). */
export const HERO_IMAGE_URL = `${import.meta.env.BASE_URL}images/lisboa.svg`;

/**
 * MODO PREVIEW (VITE_PREVIEW_MODE=true) — apenas para demonstração/testes:
 *  - o quiz começa sempre na primeira tela (não retoma progresso guardado)
 *  - mostra um botão discreto "Recomeçar" no canto superior direito
 *  - o CTA final abre o checkout num novo separador
 * Deixe desligado no site real.
 */
export const PREVIEW_MODE: boolean = env.VITE_PREVIEW_MODE === 'true';

/** Chave do localStorage para guardar o progresso do quiz. */
export const STORAGE_KEY = 'auxiliar-vagas-quiz:v1';

export const PROVINCES_MZ: readonly string[] = [
  'Cidade de Maputo',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
];
