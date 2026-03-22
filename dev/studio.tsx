import { createRoot } from 'react-dom/client';
import { Studio } from 'sanity';
import config from './sanity.config';

createRoot(document.getElementById('root')!).render(<Studio config={config} />);
