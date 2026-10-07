import { render } from 'preact';
import '@fontsource-variable/manrope/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/quiz.css';
import { QuizContainer } from './components/QuizContainer';

const root = document.getElementById('app');
if (root) render(<QuizContainer />, root);
