import React from 'react';
import hardDriveIcon from '../../assets/images/Icons/HD/Local Disk.png';


const MyComputerTemplate = () => {
  return (
    <div className="my-computer-contener">
      <div className="my-computer-left-panel">

      </div>
      <div className="my-computer-right-panel">
          <p>Hard Drives</p>
          <img src={hardDriveIcon} alt="CMD" className="start-menu-icon" /> Local Disck (C:)

      </div>
  </div>
  );
};

export default MyComputerTemplate;
