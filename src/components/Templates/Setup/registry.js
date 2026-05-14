import AgaresCMSSetup from './agarescmsSetup';
import BenderSetup from './benderSetup';
import CookieScannerSetup from './cookiescannerSetup';
import AgaresSaaSSetup from './agaressaasSetup';
import RAGChatbotSetup from './ragchatbotSetup';
import PiesCiMordeLizalSetup from './piescimordelizalSetup';
import PersonalHQSetup from './personalhqSetup';

const projectRegistry = [
  {
    template: 'personalhqSetup',
    data: PersonalHQSetup,
    installDate: '2026-05',
    size: '6.8 GB',
    usage: 'Daily',
  },
  {
    template: 'agarescmsSetup',
    data: AgaresCMSSetup,
    installDate: '2024',
    size: '5.2 GB',
    usage: 'Frequently',
  },
  {
    template: 'agaressaasSetup',
    data: AgaresSaaSSetup,
    installDate: '2026-03',
    size: '3.6 GB',
    usage: 'Daily',
  },
  {
    template: 'cookiescannerSetup',
    data: CookieScannerSetup,
    installDate: '2026-01',
    size: '412 MB',
    usage: 'Frequently',
  },
  {
    template: 'ragchatbotSetup',
    data: RAGChatbotSetup,
    installDate: '2026-03',
    size: '780 MB',
    usage: 'Occasionally',
  },
  {
    template: 'piescimordelizalSetup',
    data: PiesCiMordeLizalSetup,
    installDate: '2026-01',
    size: '1.4 GB',
    usage: 'Frequently',
  },
  {
    template: 'benderSetup',
    data: BenderSetup,
    installDate: '2025-12',
    size: '1.1 GB',
    usage: 'Frequently',
  },
];

export default projectRegistry;
