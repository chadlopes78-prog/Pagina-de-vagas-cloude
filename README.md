# Auxiliar de Vagas — Quiz / Funil Moçambique → Portugal

Funil interativo de avaliação inicial de perfil (mobile-first), feito com **Vite + Preact + TypeScript**. JS ~16 KB gzip, sem bibliotecas de UI.

## Comandos

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build de produção (pasta dist/)
npm test           # testes unitários (pontuação, validação, câmbio, upload, navegação)
```

## Configuração (sem mexer no resto do código)

Tudo está em **`src/config.ts`** ou num ficheiro `.env` (ver `.env.example`):

| O quê | Onde |
|---|---|
| URL do checkout do botão "GARANTIR O MEU ESPAÇO AGORA" | `VITE_FINAL_CTA_URL` (ou `FINAL_CTA_URL` em `src/config.ts`) |
| Taxa EUR → MZN dos exemplos de salário | `VITE_EUR_TO_MZN_RATE` (ou `DEFAULT_EUR_TO_MZN_RATE`) |
| Valores dos exemplos de salário | `SALARY_EXAMPLES_EUR` |
| Endpoint para receber o currículo (opcional) | `VITE_CV_UPLOAD_ENDPOINT` |
| Tamanho máximo / formatos do currículo | `CV_MAX_SIZE_MB`, `CV_ACCEPTED_EXTENSIONS` |
| Imagem da primeira tela | `HERO_IMAGE_URL` (por omissão, a ilustração `public/images/lisboa.svg`) |
| Critérios e pesos da pontuação | `SCORE_WEIGHTS` em `src/quiz/score.ts` |

Enquanto `VITE_FINAL_CTA_URL` estiver vazio, o botão final mostra um aviso em vez de redirecionar.
Sem `VITE_CV_UPLOAD_ENDPOINT`, o currículo é apenas validado no navegador e não é enviado para nenhum servidor.

## Estrutura

```
src/
  config.ts                 configuração editável
  quiz/                     lógica (sem UI)
    types.ts                estado e respostas
    navigation.ts           ordem das etapas, progresso, voltar
    useQuiz.ts              estado central + botão voltar do navegador
    persistence.ts          progresso guardado no localStorage
    validation.ts           validação do formulário
    score.ts                cálculo do índice de compatibilidade
    currency.ts             conversão EUR/MZN
    cvUpload.ts             validação e envio do currículo
    cta.ts                  redirecionamento final
  components/               QuizContainer, Header, ProgressBar, ChoiceGroup, Button, StepLayout, Icon
  steps/                    uma etapa por ficheiro
  styles/                   tokens, base, estilos do quiz
```

O texto evita promessas de emprego: fala em "avaliação inicial", "índice de compatibilidade" e "próxima etapa de candidatura", e inclui o aviso legal na etapa final.
