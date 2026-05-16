import FolderWindow from './FolderWindow';
import PDFWindow from './PDFWindow';
import FileWindow from './FileWindow';
import ImageWindow from './ImageWindow';
import RecycleBin from './RecycleBin';
import MyComputer from './MyComputer';
import AlertWindow from './AlertWindow';
import CMDWindow from '../CMD/CMDWindow';
import Paint from '../Paint/PaintApp';
import Minesweeper from '../Minesweeper/MinesweeperApp';
import Snake from '../Snake/SnakeApp';
import DSJ from '../DSJ/DeluxeSkiJumpApp';
import Email from '../Email/EmailApp';
import SetupWizard from './SetupWizard';
import ControlPanel from './ControlPanel';

export const windowRegistry = {
  'Recycle Bin': RecycleBin,
  'My Computer': MyComputer,
  'Folder': FolderWindow,
  'CMD': CMDWindow,
  'File': FileWindow,
  'Image': ImageWindow,
  'PDF': PDFWindow,
  'Paint': Paint,
  'Minesweeper': Minesweeper,
  'Snake': Snake,
  'DSJ': DSJ,
  'Email': Email,
  'Setup': SetupWizard,
  'Control Panel': ControlPanel,
  'Alert': AlertWindow,
};
