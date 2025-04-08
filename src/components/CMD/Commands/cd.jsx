import folderStructure from '../../folderStructure.json';

const resolvePath = (pathArray, structure, getLastMeta = false) => {
  let current = structure;

  for (let i = 0; i < pathArray.length; i++) {
    let key = pathArray[i];
    if (i === 0 && key.endsWith(':')) key = key.replace(':', '');

    if (!current || typeof current !== 'object' || !current.hasOwnProperty(key)) {
      return null;
    }

    const next = current[key];

    if (i === pathArray.length - 1 && getLastMeta) {
      return next; // return the full object (including .restricted)
    }

    current =
      next && typeof next === 'object' && next.icons
        ? next.icons
        : next;
  }

  return current;
};





const cd = (params, currentPath, structure = folderStructure) => {
  if (!params.length) {
    return {
      path: currentPath,
      message: 'CD [directory] - Changes the current directory.'
    };
  }

  let target = params.join(' ').replace(/^"|"$/g, '');
  let newPath;

  if (target === '..') {
    if (currentPath.length > 1) {
      newPath = [...currentPath];
      newPath.pop();
    } else {
      return {
        path: currentPath,
        message: 'Already at root directory.'
      };
    }
  } else if (target.includes(':\\')) {
    newPath = target.split('\\');
  } else {
    newPath = [...currentPath, target];
  }

  const folderMeta = resolvePath(newPath, structure, true);

  if (folderMeta?.restricted) {
    return {
      path: currentPath,
      message: `Access denied`
    };
  }

  const resolved = resolvePath(newPath, structure);
  if (resolved && typeof resolved === 'object') {
    return {
      path: newPath,
      // message: `Changed directory to ${newPath.join('\\')}`
    };
  } else {
    return {
      path: currentPath,
      message: `The system cannot find the path specified: ${target}`
    };
  }
};


export default cd;
