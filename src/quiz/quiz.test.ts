import { describe, expect, it } from 'vitest';
import { getVideoSource, parseVideoUrl } from './video';
import { eurToMzn, formatEur, formatMzn } from './currency';
import { validateCvFile } from './cvUpload';
import { canGoBack, getNextStep, goBack, goNext, goTo } from './navigation';
import { calculateScore, formatScore } from './score';
import { EMPTY_ANSWERS, type QuizAnswers, type QuizState } from './types';
import { validateAge, validateName, validatePersonalInfo, validateProvince } from './validation';

const answers = (patch: Partial<QuizAnswers> = {}): QuizAnswers => ({
  ...EMPTY_ANSWERS,
  name: 'Ana',
  age: '27',
  province: 'Nampula',
  ...patch,
});

describe('score', () => {
  it('perfil completo atinge 10,0', () => {
    expect(
      calculateScore(answers({ completed12th: true, hasWorkExperience: true, salaryOpinion: 'fair', hasCV: true })),
    ).toBe(10);
  });

  it('varia conforme as respostas', () => {
    const a = calculateScore(answers({ completed12th: true, hasWorkExperience: false, salaryOpinion: 'fair', hasCV: false }));
    const b = calculateScore(answers({ completed12th: false, hasWorkExperience: false, salaryOpinion: 'notFair', hasCV: false }));
    expect(a).toBe(8.1);
    expect(b).toBe(6.6);
  });

  it('considera a faixa etária', () => {
    const base = { completed12th: true, hasWorkExperience: true, salaryOpinion: 'fair' as const, hasCV: true };
    expect(calculateScore(answers({ ...base, age: '40' }))).toBe(9.6);
    expect(calculateScore(answers({ ...base, age: '60' }))).toBe(8.8);
  });

  it('fica sempre entre 0 e 10', () => {
    const s = calculateScore({ ...EMPTY_ANSWERS });
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(10);
  });

  it('formata com vírgula', () => {
    expect(formatScore(8.7)).toBe('8,7');
    expect(formatScore(10)).toBe('10,0');
  });
});

describe('validação', () => {
  it('nome', () => {
    expect(validateName('')).toBeDefined();
    expect(validateName('A')).toBeDefined();
    expect(validateName('João Manuel')).toBeUndefined();
    expect(validateName('123')).toBeDefined();
  });

  it('idade', () => {
    expect(validateAge('')).toBeDefined();
    expect(validateAge('17')).toBeDefined();
    expect(validateAge('18')).toBeUndefined();
    expect(validateAge('66')).toBeDefined();
    expect(validateAge('2a')).toBeDefined();
  });

  it('província', () => {
    expect(validateProvince('')).toBeDefined();
    expect(validateProvince('Lisboa')).toBeDefined();
    expect(validateProvince('Gaza')).toBeUndefined();
  });

  it('formulário completo', () => {
    expect(validatePersonalInfo({ name: '', age: '', province: '' })).toHaveProperty('name');
    expect(validatePersonalInfo({ name: 'Ana', age: '30', province: 'Tete' })).toEqual({});
  });
});

describe('câmbio', () => {
  it('converte com a taxa indicada', () => {
    expect(eurToMzn(1000, 70)).toBe(70000);
  });
  it('formata valores', () => {
    expect(formatEur(1500)).toBe('€1.500');
    expect(formatMzn(66_640)).toBe('66.600 MT');
  });
});

describe('currículo', () => {
  const file = (name: string, size = 1000, type = '') => ({ name, size, type });
  it('aceita PDF/DOC/DOCX', () => {
    expect(validateCvFile(file('cv.pdf', 1000, 'application/pdf'))).toBeUndefined();
    expect(validateCvFile(file('cv.DOCX'))).toBeUndefined();
    expect(validateCvFile(file('cv.doc', 1000, 'application/msword'))).toBeUndefined();
  });
  it('rejeita outros formatos, vazios e grandes', () => {
    expect(validateCvFile(file('foto.jpg', 1000, 'image/jpeg'))).toMatch(/Formato/);
    expect(validateCvFile(file('cv.pdf', 1000, 'image/png'))).toMatch(/Formato/);
    expect(validateCvFile(file('cv.pdf', 0))).toMatch(/vazio/);
    expect(validateCvFile(file('cv.pdf', 6 * 1024 * 1024))).toMatch(/grande/);
  });
});

describe('navegação', () => {
  const state = (patch: Partial<QuizState> = {}): QuizState => ({
    step: 'welcome',
    history: [],
    answers: answers(),
    ...patch,
  });

  it('segue o fluxo com currículo', () => {
    expect(getNextStep('cv', answers({ hasCV: true }))).toBe('cvUpload');
    expect(getNextStep('cvUpload', answers())).toBe('cvAnalysis');
    expect(getNextStep('cvAnalysis', answers())).toBe('profileAnalysis');
  });

  it('segue o fluxo sem currículo', () => {
    expect(getNextStep('cv', answers({ hasCV: false }))).toBe('noCv');
    expect(getNextStep('noCv', answers())).toBe('profileAnalysis');
  });

  it('voltar preserva respostas e salta etapas automáticas', () => {
    let s = state({ step: 'cvUpload', history: ['welcome', 'personal', 'education', 'experience', 'salary', 'cv'] });
    s = goNext(s); // cvAnalysis
    s = goNext(s); // profileAnalysis
    s = goNext(s); // score
    expect(s.step).toBe('score');
    const back = goBack(s);
    expect(back.step).toBe('cvUpload');
    expect(back.answers).toEqual(s.answers);
  });

  it('não mostra voltar no início nem nas análises', () => {
    expect(canGoBack(state())).toBe(false);
    expect(canGoBack(state({ step: 'personal', history: ['welcome'] }))).toBe(true);
    expect(canGoBack(state({ step: 'profileAnalysis', history: ['welcome'] }))).toBe(false);
  });

  it('"Não" leva à mensagem e permite voltar', () => {
    const declined = goTo(state(), 'declined');
    expect(declined.step).toBe('declined');
    expect(goBack(declined).step).toBe('welcome');
  });
});

describe('vídeo', () => {
  it('vazio ou inválido mostra placeholder', () => {
    expect(parseVideoUrl('').kind).toBe('none');
    expect(parseVideoUrl('isto não é url').kind).toBe('none');
    expect(parseVideoUrl('javascript:alert(1)').kind).toBe('none');
  });
  it('YouTube em vários formatos', () => {
    for (const u of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10',
    ]) {
      const v = parseVideoUrl(u);
      expect(v.kind).toBe('youtube');
      if (v.kind === 'youtube') expect(v.id).toBe('dQw4w9WgXcQ');
    }
  });
  it('Vimeo, ficheiro e iframe genérico', () => {
    expect(parseVideoUrl('https://vimeo.com/123456789').kind).toBe('vimeo');
    expect(parseVideoUrl('videos/vsl.mp4').kind).toBe('file');
    expect(parseVideoUrl('https://cdn.exemplo.com/a.webm?x=1').kind).toBe('file');
    expect(parseVideoUrl('https://player.exemplo.com/embed/abc').kind).toBe('iframe');
  });
});

describe('VTurb', () => {
  const script = 'https://scripts.converteai.net/abc/players/6ac68d14da9cef979b95782d/v4/player.js';
  it('tem prioridade sobre VIDEO_URL e aceita o prefixo vid-', () => {
    const v = getVideoSource('vid-6ac68d14da9cef979b95782d', script, 'https://youtu.be/dQw4w9WgXcQ');
    expect(v).toEqual({ kind: 'vturb', playerId: '6ac68d14da9cef979b95782d', scriptUrl: script });
  });
  it('sem VTurb usa VIDEO_URL ou o placeholder', () => {
    expect(getVideoSource('', '', 'https://youtu.be/dQw4w9WgXcQ').kind).toBe('youtube');
    expect(getVideoSource('', '', '').kind).toBe('none');
    expect(getVideoSource('abc', 'http://inseguro.com/p.js', '').kind).toBe('none');
  });
});
