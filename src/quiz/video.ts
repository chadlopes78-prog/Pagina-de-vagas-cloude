import { VIDEO_URL } from '../config';

export type VideoSource =
  | { kind: 'none' }
  | { kind: 'youtube'; id: string; embedUrl: string; thumbnailUrl: string }
  | { kind: 'vimeo'; id: string; embedUrl: string }
  | { kind: 'file'; src: string }
  | { kind: 'iframe'; embedUrl: string };

const FILE_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i;

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') return url.searchParams.get('v');
    const m = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
    return m ? m[2] : null;
  }
  return null;
}

function vimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '');
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
  const m = url.pathname.match(/(\d{6,})/);
  return m ? m[1] : null;
}

/** Identifica o tipo de vídeo a partir do URL configurado. */
export function parseVideoUrl(raw: string = VIDEO_URL): VideoSource {
  const value = raw.trim();
  if (!value) return { kind: 'none' };

  // Ficheiro local (ex.: 'videos/vsl.mp4') ou remoto
  if (FILE_EXT.test(value)) return { kind: 'file', src: value };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { kind: 'none' };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { kind: 'none' };

  const yt = youtubeId(url);
  if (yt && /^[\w-]{6,}$/.test(yt)) {
    return {
      kind: 'youtube',
      id: yt,
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  const vm = vimeoId(url);
  if (vm) {
    return { kind: 'vimeo', id: vm, embedUrl: `https://player.vimeo.com/video/${vm}?autoplay=1&title=0&byline=0&portrait=0` };
  }

  return { kind: 'iframe', embedUrl: url.toString() };
}
