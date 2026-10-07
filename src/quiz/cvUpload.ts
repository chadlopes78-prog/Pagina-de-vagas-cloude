import { CV_ACCEPTED_EXTENSIONS, CV_ACCEPTED_MIME_TYPES, CV_MAX_SIZE_MB, CV_UPLOAD_ENDPOINT } from '../config';
import type { CvFileInfo } from './types';

export const CV_ACCEPT_ATTRIBUTE = [
  ...CV_ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`),
  ...CV_ACCEPTED_MIME_TYPES,
].join(',');

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : '';
}

/** Valida tipo, tamanho e nome. Devolve mensagem de erro amigável ou undefined. */
export function validateCvFile(file: Pick<File, 'name' | 'size' | 'type'>): string | undefined {
  const name = file.name.trim();
  if (!name || name.length > 150) {
    return 'O nome do ficheiro não é válido. Renomeie-o e tente novamente.';
  }
  const ext = extensionOf(name);
  const extOk = CV_ACCEPTED_EXTENSIONS.includes(ext);
  // Alguns telemóveis Android enviam type vazio ou genérico — a extensão é o critério principal.
  const mimeOk = !file.type || file.type === 'application/octet-stream' || CV_ACCEPTED_MIME_TYPES.includes(file.type);
  if (!extOk || !mimeOk) {
    return 'Formato não suportado. Envie o currículo em PDF, DOC ou DOCX.';
  }
  if (file.size === 0) {
    return 'O ficheiro está vazio. Escolha outro ficheiro.';
  }
  if (file.size > CV_MAX_SIZE_MB * 1024 * 1024) {
    return `O ficheiro é demasiado grande. O tamanho máximo é ${CV_MAX_SIZE_MB} MB.`;
  }
  return undefined;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

/**
 * Envia o currículo para CV_UPLOAD_ENDPOINT, se configurado.
 * Sem endpoint, o ficheiro fica apenas no dispositivo e devolve uploaded=false.
 * Um erro de rede não bloqueia o fluxo do utilizador.
 */
export async function uploadCv(file: File): Promise<CvFileInfo> {
  const info: CvFileInfo = { name: file.name, size: file.size, type: file.type, uploaded: false };
  if (!CV_UPLOAD_ENDPOINT) return info;
  try {
    const body = new FormData();
    body.append('cv', file, file.name);
    const res = await fetch(CV_UPLOAD_ENDPOINT, { method: 'POST', body });
    return { ...info, uploaded: res.ok };
  } catch {
    return info;
  }
}
