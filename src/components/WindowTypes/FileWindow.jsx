import React, { Suspense, lazy } from 'react';
import Window from '../Window';

const FileWindow = ({ id, title, onClose, position, template }) => {
    const TemplateComponent = lazy(() => import(`../Templates/File${template}`));

    return (
        <Window id={id} title={title} onClose={onClose} position={position}>
            <Suspense fallback={<div>Loading...</div>}>
                <TemplateComponent />
            </Suspense>
        </Window>
    );
};

export default FileWindow;
