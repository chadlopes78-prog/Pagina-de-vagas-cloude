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
 * Enquanto estiver vazio, o botão mostra um aviso em vez de redirecionar.
 */
export const FINAL_CTA_URL: string = (env.VITE_FINAL_CTA_URL as string | undefined)?.trim() || '';

/**
 * Se true, acrescenta ao FINAL_CTA_URL os parâmetros ?score=..&province=..
 * (útil para o checkout/CRM saber de onde vem o lead). Nome nunca é enviado.
 */
export const FINAL_CTA_APPEND_PARAMS = false;

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
