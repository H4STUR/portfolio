import React, { useEffect, useRef, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';
import imageMap from '../../utils/imageMap';
import '../../styles/setupWizard.css';

const STEPS = [
  { id: 'about',    label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'tech',     label: 'Tech Stack' },
  { id: 'install',  label: 'Tour' },
  { id: 'finish',   label: 'Launch' },
];

const AboutStep = ({ data }) => (
  <>
    <h2 className="setup-wizard-step-title">{data.projectName}</h2>
    <p className="setup-wizard-step-subtitle">{data.tagline}</p>
    <p className="setup-wizard-text">{data.about}</p>
    {data.highlights && data.highlights.length > 0 && (
      <div className="setup-wizard-highlights">
        {data.highlights.map((h) => (
          <div className="setup-wizard-highlight" key={h.label}>
            <div className="setup-wizard-highlight-number">{h.number}</div>
            <div className="setup-wizard-highlight-label">{h.label}</div>
          </div>
        ))}
      </div>
    )}
  </>
);

const FeaturesStep = ({ data }) => (
  <>
    <h2 className="setup-wizard-step-title">What it can do</h2>
    <p className="setup-wizard-step-subtitle">Features shipped in this build</p>
    <div className="setup-wizard-features">
      {data.features.map((f) => (
        <div className="setup-wizard-feature" key={f.name}>
          <div className="setup-wizard-feature-name">{f.name}</div>
          <div className="setup-wizard-feature-desc">{f.description}</div>
        </div>
      ))}
    </div>
  </>
);

const TechStep = ({ data }) => (
  <>
    <h2 className="setup-wizard-step-title">Under the hood</h2>
    <p className="setup-wizard-step-subtitle">The stack — and why each piece is in it</p>
    <div className="setup-wizard-tech-list">
      {data.techStack.map((t) => {
        const name = typeof t === 'string' ? t : t.name;
        const reason = typeof t === 'string' ? null : t.reason;
        return (
          <div className="setup-wizard-tech" key={name}>
            <div className="setup-wizard-tech-name">{name}</div>
            {reason && <div className="setup-wizard-tech-reason">{reason}</div>}
          </div>
        );
      })}
    </div>
  </>
);

const InstallStep = ({ data, progress, shot, onOpenImage }) => {
  const shots = data.screenshots || [];
  if (shots.length === 0) {
    return (
      <>
        <h2 className="setup-wizard-step-title">A quick tour</h2>
        <p className="setup-wizard-step-subtitle">Screenshots coming soon</p>
        <div className="setup-wizard-placeholder">
          <div className="setup-wizard-placeholder-frame">
            <div className="setup-wizard-placeholder-text">No preview yet</div>
          </div>
          <p className="setup-wizard-text">
            This project doesn't have screenshots in the portfolio yet. Use the link on the next
            page to see it running for real, or check the repo to read the code.
          </p>
        </div>
      </>
    );
  }
  const file = shot ? (typeof shot === 'string' ? shot : shot.file) : null;
  const caption = shot && typeof shot !== 'string' ? shot.caption : null;
  const shotSrc = file ? imageMap[file] : null;
  return (
    <>
      <h2 className="setup-wizard-step-title">A quick tour</h2>
      <p className="setup-wizard-step-subtitle">Loading the highlights — click any image to enlarge</p>
      {shotSrc && (
        <div className="setup-wizard-install-preview">
          <img
            src={shotSrc}
            alt={file}
            title="Click to open"
            onClick={() => onOpenImage && onOpenImage(file)}
          />
        </div>
      )}
      <div className="setup-wizard-progress-wrap">
        <div className="setup-wizard-progress">
          <div className="setup-wizard-progress-bar" style={{ width: progress + '%' }} />
        </div>
        <div className="setup-wizard-progress-label">
          {caption || (file ? `Loading: ${file}` : 'Preparing tour…')}
        </div>
        <div className="setup-wizard-progress-percent">{Math.floor(progress)}%</div>
      </div>
    </>
  );
};

const FinishStep = ({ data }) => {
  const title = data.finish?.title || 'Ready to launch';
  const subtitle = data.finish?.subtitle || `${data.projectName} is live and waiting`;
  const text = data.finish?.text || (
    `That's the tour. ${data.projectName} is in active production - every feature on the previous ` +
    'pages is shipped, tested, and running today. The fastest way to feel it is to click in.'
  );
  return (
    <>
      <h2 className="setup-wizard-step-title">{title}</h2>
      <p className="setup-wizard-step-subtitle">{subtitle}</p>
      <p className="setup-wizard-text">{text}</p>
      <div className="setup-wizard-finish-options">
        {data.links?.demo && (
          <a href={data.links.demo.url} target="_blank" rel="noopener noreferrer">
            → {data.links.demo.label}
          </a>
        )}
        {data.links?.repo && (
          <a href={data.links.repo.url} target="_blank" rel="noopener noreferrer">
            → {data.links.repo.label}
          </a>
        )}
      </div>
    </>
  );
};

const computeDefaultSize = () => ({
  width: Math.round(window.innerWidth * 0.7),
  height: Math.round(window.innerHeight * 0.7),
});

const SetupWizard = ({ id, title, onClose, position, template, openWindow, initialSize }) => {
  const resolvedSize = initialSize || computeDefaultSize();
  const resolvedPosition = {
    x: Math.max(0, Math.round((window.innerWidth - resolvedSize.width) / 2)),
    y: Math.max(0, Math.round((window.innerHeight - resolvedSize.height) / 2)),
  };
  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shotIdx, setShotIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadTemplate(template)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => console.error('[SetupWizard] template load failed:', e));
    return () => { cancelled = true; };
  }, [template]);

  useEffect(() => {
    if (STEPS[step].id !== 'install' || !data) return;
    const shots = data.screenshots || [];
    if (shots.length === 0) {
      setProgress(100);
      return;
    }
    setProgress(0);
    setShotIdx(0);
    const start = Date.now();
    const duration = 4500;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      const shots = data.screenshots || [];
      if (shots.length) {
        setShotIdx(Math.min(shots.length - 1, Math.floor((pct / 100) * shots.length)));
      }
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [step, data]);

  if (!data) {
    return (
      <Window id={id} title={title} onClose={onClose} position={resolvedPosition} size={resolvedSize} className="window setup-wizard-window">
        <div className="setup-wizard"><div className="setup-wizard-content">Loading…</div></div>
      </Window>
    );
  }

  const currentStep = STEPS[step];
  const current = currentStep.id;
  const isInstalling = current === 'install' && progress < 100;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;
  const prevLabel = !isFirst ? STEPS[step - 1].label : null;
  const nextLabel = !isLast ? STEPS[step + 1].label : null;

  const goBack = () => { if (!isFirst && !isInstalling) setStep((s) => s - 1); };
  const goNext = () => {
    if (isInstalling) return;
    if (isLast) onClose(id);
    else setStep((s) => s + 1);
  };

  const bannerSrc = data.banner ? imageMap[data.banner] : null;
  const shots = data.screenshots || [];
  const currentShot = shots.length ? shots[shotIdx] : null;

  const openImage = (filename) => {
    if (!openWindow || !filename) return;
    openWindow('Image', filename, filename, [], { x: 200, y: 120 }, { width: 900, height: 580 });
  };

  return (
    <Window id={id} title={title} onClose={onClose} position={resolvedPosition} size={resolvedSize} className="window setup-wizard-window">
      <div className="setup-wizard">
        <div className="setup-wizard-body">
          <div className="setup-wizard-art">
            <div className="setup-wizard-art-title">{data.projectName}</div>
            {data.tagline && <div className="setup-wizard-art-tag">{data.tagline}</div>}
            {bannerSrc ? (
              <img
                className="setup-wizard-art-image clickable"
                src={bannerSrc}
                alt={data.banner}
                title="Click to open"
                onClick={() => openImage(data.banner)}
              />
            ) : (
              <div className="setup-wizard-art-image-placeholder">
                <span>No preview yet</span>
              </div>
            )}
            <div className="setup-wizard-art-steps">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={'setup-wizard-art-step' + (i === step ? ' current' : '') + (i < step ? ' done' : '')}
                >
                  <span className="setup-wizard-art-step-dot" />
                  {s.label}
                </div>
              ))}
            </div>
            <div className="setup-wizard-art-meta">
              {data.publisher && <div>Publisher: {data.publisher}</div>}
              {data.version && <div>Version: {data.version}</div>}
            </div>
          </div>
          <div className="setup-wizard-content">
            {current === 'about' && <AboutStep data={data} />}
            {current === 'features' && <FeaturesStep data={data} />}
            {current === 'tech' && <TechStep data={data} />}
            {current === 'install' && (
              <InstallStep data={data} progress={progress} shot={currentShot} onOpenImage={openImage} />
            )}
            {current === 'finish' && <FinishStep data={data} />}
          </div>
        </div>
        <div className="setup-wizard-footer">
          <div className="setup-wizard-footer-spacer" />
          <button onClick={goBack} disabled={isFirst || isInstalling}>
            {prevLabel ? `< ${prevLabel}` : '< Back'}
          </button>
          <button onClick={goNext} disabled={isInstalling} className="primary">
            {isLast ? 'Finish' : `${nextLabel} >`}
          </button>
          <button onClick={() => onClose(id)} disabled={isInstalling}>Cancel</button>
        </div>
      </div>
    </Window>
  );
};

export default SetupWizard;
