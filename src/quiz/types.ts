export type StepId =
  | 'welcome'
  | 'declined'
  | 'personal'
  | 'education'
  | 'experience'
  | 'salary'
  | 'cv'
  | 'cvUpload'
  | 'cvAnalysis'
  | 'noCv'
  | 'profileAnalysis'
  | 'score'
  | 'final';

export type SalaryOpinion = 'fair' | 'notFair';

/** Metadados do currículo (o File em si não é serializável para o localStorage). */
export interface CvFileInfo {
  name: string;
  size: number;
  type: string;
  /** true quando o ficheiro foi enviado para CV_UPLOAD_ENDPOINT. */
  uploaded: boolean;
}

export interface QuizAnswers {
  name: string;
  age: string;
  province: string;
  completed12th: boolean | null;
  hasWorkExperience: boolean | null;
  salaryOpinion: SalaryOpinion | null;
  hasCV: boolean | null;
  cvFile: CvFileInfo | null;
  score: number | null;
}

export interface QuizState {
  step: StepId;
  /** Etapas visitadas antes da actual (para o botão "voltar"). */
  history: StepId[];
  answers: QuizAnswers;
}

export const EMPTY_ANSWERS: QuizAnswers = {
  name: '',
  age: '',
  province: '',
  completed12th: null,
  hasWorkExperience: null,
  salaryOpinion: null,
  hasCV: null,
  cvFile: null,
  score: null,
};
