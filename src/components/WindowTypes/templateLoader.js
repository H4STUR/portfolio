const loadTemplate = async (template) => {
    switch (template) {
    //Files
      case 'FileTemplate':
        return (await import('../Templates/File/FileTemplate')).default;
      case 'NotesTemplate':
        return (await import('../Templates/File/NotesTemplate')).default;
      //projects
      case 'agaresstoreTemplate':
        return (await import('../Templates/File/projects/agaresstoreTemplate')).default;
      case 'agarescmsTemplate':
        return (await import('../Templates/File/projects/agarescmsTemplate')).default;
      case 'benderTemplate':
        return (await import('../Templates/File/projects/benderTemplate')).default;
      case 'cookiescannerTemplate':
        return (await import('../Templates/File/projects/cookiescannerTemplate')).default;
      case 'piescimordelizalTemplate':
        return (await import('../Templates/File/projects/piescimordelizalTemplate')).default;

    //Setup wizards
      case 'agarescmsSetup':
        return (await import('../Templates/Setup/agarescmsSetup')).default;
      case 'benderSetup':
        return (await import('../Templates/Setup/benderSetup')).default;
      case 'cookiescannerSetup':
        return (await import('../Templates/Setup/cookiescannerSetup')).default;
      case 'agaressaasSetup':
        return (await import('../Templates/Setup/agaressaasSetup')).default;
      case 'ragchatbotSetup':
        return (await import('../Templates/Setup/ragchatbotSetup')).default;
      case 'piescimordelizalSetup':
        return (await import('../Templates/Setup/piescimordelizalSetup')).default;
      case 'personalhqSetup':
        return (await import('../Templates/Setup/personalhqSetup')).default;


      case 'readmeTemplate':
        return (await import('../Templates/File/readmeTemplate')).default;
      case 'todoTemplate':
        return (await import('../Templates/File/todoTemplate')).default;
      case 'LockedTemplate':
        return (await import('../Templates/File/LockedTemplate')).default;
    //PDF
      case 'PDFTemplate':
        return (await import('../Templates/PDF/PDFTemplate')).default;
      case 'CV':
        return (await import('../Templates/PDF/CV')).default;
    //Other
      case 'RecycleBinTemplate':
        return (await import('../Templates/RecycleBinTemplate')).default;
      case 'FolderTemplate':
        return (await import('../Templates/FolderTemplate')).default;
      case 'MyComputerTemplate':
        return (await import('../Templates/MyComputerTemplate')).default;
      
      default:
        return (await import('../Templates/File/FileTemplate')).default;
    }
  };
  
  export default loadTemplate;
  