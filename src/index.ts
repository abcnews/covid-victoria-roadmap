import 'regenerator-runtime/runtime.js';
import App from './components/App/App.svelte';
import './fonts.scss';

const PROJECT_NAME: string = 'covid-victoria-roadmap';
const ROOT_SELECTOR = `[data-${PROJECT_NAME}-root]`;

const root = document.querySelector(ROOT_SELECTOR);

if (root) {
  new App({
    target: root
  });
}

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
