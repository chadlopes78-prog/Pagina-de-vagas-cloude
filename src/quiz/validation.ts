import { MAX_AGE, MIN_AGE, PROVINCES_MZ } from '../config';
import type { QuizAnswers } from './types';

export type PersonalField = 'name' | 'age' | 'province';
export type PersonalErrors = Partial<Record<PersonalField, string>>;

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return 'Indique o seu nome.';
  if (value.length < 2) return 'O nome deve ter pelo menos 2 letras.';
  if (value.length > 60) return 'O nome é demasiado longo.';
  if (!/^[\p{L}\s'.-]+$/u.test(value)) return 'Use apenas letras no nome.';
  return undefined;
}

export function validateAge(age: string): string | undefined {
  const value = age.trim();
  if (!value) return 'Indique a sua idade.';
  if (!/^\d{1,3}$/.test(value)) return 'Indique a idade apenas com números.';
  const n = Number(value);
  if (n < MIN_AGE) return `É necessário ter pelo menos ${MIN_AGE} anos.`;
  if (n > MAX_AGE) return `Indique uma idade até ${MAX_AGE} anos.`;
  return undefined;
}

export function validateProvince(province: string): string | undefined {
  if (!province) return 'Escolha a sua província.';
  if (!PROVINCES_MZ.includes(province)) return 'Escolha uma província da lista.';
  return undefined;
}

export function validatePersonalInfo(answers: Pick<QuizAnswers, PersonalField>): PersonalErrors {
  const errors: PersonalErrors = {};
  const name = validateName(answers.name);
  const age = validateAge(answers.age);
  const province = validateProvince(answers.province);
  if (name) errors.name = name;
  if (age) errors.age = age;
  if (province) errors.province = province;
  return errors;
}

export function hasErrors(errors: PersonalErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Primeiro nome, para personalizar as mensagens. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}
