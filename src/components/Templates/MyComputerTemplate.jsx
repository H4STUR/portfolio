import React from 'react';
import hardDriveIcon from '../../assets/images/Icons/HD/Local Disk.png';
import floppyIcon from '../../assets/images/Icons/HD/Floppy Disk.png';
import '../../styles/myComputer.css';


const MyComputerTemplate = () => {
  return (
    <div className="my-computer-contener">
      <div className="my-computer-left-panel">
        <p>Other Places</p>
      </div>
      <div className="my-computer-right-panel">
        <div>
          <p className='my-computer-title'>Hard Drives:</p>
          <div className='my-computer-drive'>
            <img src={hardDriveIcon} alt="CMD" className="my-computer-icon" /> <p>Local Disck (C:)</p>
          </div>
        </div>
        <div>
          <p className='my-computer-title'>Devices with Removable Storage:</p>
          <div className='my-computer-drive'>
            <img src={floppyIcon} alt="CMD" className="my-computer-icon" /> <p>Local Disck (C:)</p>
          </div>
        </div>

      </div>
  </div>
  );
};

export default MyComputerTemplate;
