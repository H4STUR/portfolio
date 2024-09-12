// Import the folder structure JSON directly
import folderStructure from '../../folderStructure.json';

// Helper function to resolve the path to the target folder in the structure
const resolvePath = (pathArray, structure) => {
  let current = structure;
  for (const dir of pathArray.slice(1)) { // Skip 'C:' for traversal
    if (current[dir] && current[dir].icons) {
      current = current[dir].icons;
    } else if (current[dir]) {
      current = current[dir];
    } else {
      return null; // Path not found
    }
  }
  return current;
};

const cd = (params, currentPath, structure) => {
  if (params.length === 0) {
    return { path: currentPath, message: 'CD [directory] - Changes the current directory.' };
  }

  const folderName = params[0];

  if (folderName === '..') {
    // Move up one level
    if (currentPath.length > 1) {
      const newPath = [...currentPath];
      newPath.pop();
      return { path: newPath, message: `Moved up to ${newPath.join('\\')}` };
    } else {
      return { path: currentPath, message: 'You are already at the root directory.' };
    }
  } else {
    // Move into the specified folder
    const newPath = [...currentPath, folderName];
    const resolved = resolvePath(newPath, structure);

    if (resolved) {
      return { path: newPath, message: `Changed directory to ${newPath.join('\\')}` };
    } else {
      return { path: currentPath, message: `The system cannot find the path specified: ${folderName}` };
    }
  }
};

export default cd;
