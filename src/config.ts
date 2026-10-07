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
 * VÍDEO DA ETAPA FINAL — PLAYER VTURB (ConverteAI).
 *
 * >>> PARA TROCAR O VÍDEO, ALTERE ESTES DOIS VALORES <<<
 * Copie-os do código de incorporação da VTurb:
 *   <vturb-smartplayer id="vid-XXXX">  →  VTURB_PLAYER_ID = 'XXXX'
 *   s.src="https://scripts.converteai.net/.../player.js"  →  VTURB_SCRIPT_URL
 * (ou use VITE_VTURB_PLAYER_ID e VITE_VTURB_SCRIPT_URL no .env)
 *
 * Se ficarem vazios, é usado VIDEO_URL (abaixo).
 */
export const VTURB_PLAYER_ID: string =
  (env.VITE_VTURB_PLAYER_ID as string | undefined)?.trim() || '6ac68d14da9cef979b95782d';
export const VTURB_SCRIPT_URL: string =
  (env.VITE_VTURB_SCRIPT_URL as string | undefined)?.trim() ||
  'https://scripts.converteai.net/8b709eb2-af1f-4db8-b427-9ada800973a9/players/6ac68d14da9cef979b95782d/v4/player.js';

/**
 * Alternativa à VTurb: URL de vídeo (usado só se a VTurb não estiver configurada).
 * Aceita YouTube, Vimeo, ficheiro .mp4/.webm (ex.: 'videos/vsl.mp4' em public/) ou link de incorporação.
 * Vazio = mostra um placeholder elegante.
 */
export const VIDEO_URL: string = (env.VITE_VIDEO_URL as string | undefined)?.trim() || '';

/** Versão WebM de reserva para VIDEO_URL em ficheiro (opcional). */
export const VIDEO_FALLBACK_URL: string = (env.VITE_VIDEO_FALLBACK_URL as string | undefined)?.trim() || '';

/** Imagem de capa opcional para VIDEO_URL. */
export const VIDEO_POSTER_URL: string = (env.VITE_VIDEO_POSTER_URL as string | undefined)?.trim() || '';

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

/**
 * Fotografia da primeira tela (Lisboa). Para trocar, substitua os ficheiros em public/images/
 * mantendo os nomes, ou altere os caminhos abaixo. O WebP é usado quando o navegador suporta.
 */
const IMG = `${import.meta.env.BASE_URL}images/`;
export const HERO_IMAGE = {
  src: `${IMG}lisboa.jpg`,
  srcSetJpg: `${IMG}lisboa-800.jpg 800w, ${IMG}lisboa.jpg 1248w`,
  srcSetWebp: `${IMG}lisboa-800.webp 800w, ${IMG}lisboa.webp 1248w`,
  width: 1248,
  height: 702,
  alt: 'Lisboa: o Castelo de São Jorge, o casario colorido e o rio Tejo',
};

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
