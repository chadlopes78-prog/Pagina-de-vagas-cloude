import type { QuizAnswers } from './types';

/**
 * ============================================================
 *  CRITÉRIOS DO ÍNDICE DE COMPATIBILIDADE (0,0 – 10,0)
 *  Edite os pesos abaixo para ajustar a pontuação.
 * ============================================================
 *
 * O índice é uma avaliação inicial e indicativa. NÃO representa
 * garantia de contratação nem aprovação por qualquer empresa.
 */
export const SCORE_WEIGHTS = {
  base: 5.0,
  age: [
    { min: 18, max: 35, points: 1.5 },
    { min: 36, max: 45, points: 1.1 },
    { min: 46, max: 55, points: 0.6 },
    { min: 56, max: 65, points: 0.3 },
  ],
  completed12th: 1.2,
  hasWorkExperience: 1.2,
  salaryOpinion: { fair: 0.4, notFair: 0.1 },
  hasCV: 0.7,
} as const;

export const MIN_SCORE = 0;
export const MAX_SCORE = 10;

export interface ScoreFactor {
  label: string;
  points: number;
  met: boolean;
}

function agePoints(age: number): number {
  const band = SCORE_WEIGHTS.age.find((b) => age >= b.min && age <= b.max);
  return band ? band.points : 0;
}

/** Lista de factores avaliados e respectivos pontos. */
export function getScoreFactors(answers: QuizAnswers): ScoreFactor[] {
  const age = Number.parseInt(answers.age, 10);
  const ageScore = Number.isFinite(age) ? agePoints(age) : 0;
  const salaryScore = answers.salaryOpinion ? SCORE_WEIGHTS.salaryOpinion[answers.salaryOpinion] : 0;

  return [
    { label: 'Faixa etária', points: ageScore, met: ageScore > 0 },
    {
      label: 'Escolaridade (12ª classe)',
      points: answers.completed12th ? SCORE_WEIGHTS.completed12th : 0,
      met: answers.completed12th === true,
    },
    {
      label: 'Experiência profissional',
      points: answers.hasWorkExperience ? SCORE_WEIGHTS.hasWorkExperience : 0,
      met: answers.hasWorkExperience === true,
    },
    { label: 'Expectativa salarial', points: salaryScore, met: answers.salaryOpinion === 'fair' },
    { label: 'Currículo', points: answers.hasCV ? SCORE_WEIGHTS.hasCV : 0, met: answers.hasCV === true },
  ];
}

/** Calcula o índice de compatibilidade (0,0 a 10,0, uma casa decimal). */
export function calculateScore(answers: QuizAnswers): number {
  const total = getScoreFactors(answers).reduce<number>((sum, f) => sum + f.points, SCORE_WEIGHTS.base);
  const clamped = Math.min(MAX_SCORE, Math.max(MIN_SCORE, total));
  return Math.round(clamped * 10) / 10;
}

/** Formata a pontuação no padrão português: 8,7 */
export function formatScore(score: number): string {
  return score.toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export interface ScoreTier {
  label: string;
  headline: (name: string) => string;
}

/** Mensagem apresentada consoante o resultado. */
export function getScoreTier(score: number): ScoreTier {
  if (score >= 8.5) {
    return {
      label: 'Compatibilidade elevada',
      headline: (name) => `${name}, a sua avaliação inicial apresenta um resultado muito positivo.`,
    };
  }
  if (score >= 7) {
    return {
      label: 'Boa compatibilidade',
      headline: (name) => `${name}, a sua avaliação inicial apresenta um resultado positivo.`,
    };
  }
  return {
    label: 'Compatibilidade moderada',
    headline: (name) => `${name}, a sua avaliação inicial permite avançar para a próxima etapa.`,
  };
}
