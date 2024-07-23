const loadTemplate = async (template) => {
    switch (template) {
    //Files
      case 'FileTemplate':
        return (await import('../Templates/File/FileTemplate')).default;
      case 'NotesTemplate':
        return (await import('../Templates/File/NotesTemplate')).default;
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
  