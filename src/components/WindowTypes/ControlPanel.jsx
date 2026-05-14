import React, { useState, useMemo } from 'react';
import Window from '../Window';
import projectRegistry from '../Templates/Setup/registry';
import installerIcon from '../../assets/images/Icons/installer.ico';
import '../../styles/controlPanel.css';

const SORTS = {
  name:    (a, b) => a.data.projectName.localeCompare(b.data.projectName),
  size:    (a, b) => sizeBytes(b.size) - sizeBytes(a.size),
  installed: (a, b) => (b.installDate || '').localeCompare(a.installDate || ''),
  usage:   (a, b) => usageRank(b.usage) - usageRank(a.usage),
};

const sizeBytes = (s) => {
  if (!s) return 0;
  const m = s.match(/([\d.]+)\s*(MB|GB)/i);
  if (!m) return 0;
  return parseFloat(m[1]) * (m[2].toUpperCase() === 'GB' ? 1024 : 1);
};

const usageRank = (u) => ({ Daily: 3, Frequently: 2, Occasionally: 1, Rarely: 0 }[u] || 0);

const computeDefaultSize = () => ({
  width: Math.min(900, Math.round(window.innerWidth * 0.7)),
  height: Math.min(640, Math.round(window.innerHeight * 0.75)),
});

const ControlPanel = ({ id, title, onClose, openWindow, initialSize }) => {
  const resolvedSize = initialSize || computeDefaultSize();
  const resolvedPosition = {
    x: Math.max(0, Math.round((window.innerWidth - resolvedSize.width) / 2)),
    y: Math.max(0, Math.round((window.innerHeight - resolvedSize.height) / 2)),
  };

  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [sortKey, setSortKey] = useState('name');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? projectRegistry.filter((p) => {
          const d = p.data;
          return (
            d.projectName.toLowerCase().includes(q) ||
            (d.tagline || '').toLowerCase().includes(q) ||
            (d.publisher || '').toLowerCase().includes(q)
          );
        })
      : [...projectRegistry];
    return filtered.sort(SORTS[sortKey] || SORTS.name);
  }, [query, sortKey]);

  const openWizard = (entry) => {
    if (!openWindow) return;
    openWindow('Setup', `${entry.data.projectName} Setup.exe`, entry.template);
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={resolvedPosition}
      size={resolvedSize}
      className="window control-panel-window"
    >
      <div className="control-panel">
        <div className="control-panel-sidebar">
          <div className="control-panel-sidebar-section">
            <div className="control-panel-sidebar-title">Add or Remove Programs</div>
            <ul className="control-panel-sidebar-nav">
              <li className="active">
                <span className="control-panel-sidebar-icon" />
                Change or Remove Programs
              </li>
              <li className="disabled">
                <span className="control-panel-sidebar-icon" />
                Add New Programs
              </li>
              <li className="disabled">
                <span className="control-panel-sidebar-icon" />
                Add/Remove Windows Components
              </li>
              <li className="disabled">
                <span className="control-panel-sidebar-icon" />
                Set Program Access and Defaults
              </li>
            </ul>
          </div>
        </div>
        <div className="control-panel-main">
          <div className="control-panel-toolbar">
            <input
              className="control-panel-search"
              type="text"
              placeholder="Search installed programs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="control-panel-sort">
              <label>Sort by:</label>
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="installed">Date Installed</option>
                <option value="usage">Frequency of Use</option>
              </select>
            </div>
          </div>
          <div className="control-panel-header-row">
            <div className="control-panel-currently">
              Currently installed programs: <b>{visible.length}</b>
            </div>
          </div>
          <div className="control-panel-column-header">
            <span className="control-panel-row-icon-spacer" />
            <span className="control-panel-col-name">Name</span>
            <span className="control-panel-col-size">Size</span>
            <span className="control-panel-col-used">Used</span>
          </div>
          <div className="control-panel-list">
            {visible.map((entry) => {
              const expanded = expandedTemplate === entry.template;
              return (
                <div
                  key={entry.template}
                  className={'control-panel-row' + (expanded ? ' expanded' : '')}
                  onClick={() =>
                    setExpandedTemplate(expanded ? null : entry.template)
                  }
                >
                  <div className="control-panel-row-main">
                    <img src={installerIcon} alt="" className="control-panel-row-icon" />
                    <div className="control-panel-row-name">{entry.data.projectName}</div>
                    <div className="control-panel-row-cell">Size&nbsp;&nbsp;<b>{entry.size}</b></div>
                    <div className="control-panel-row-cell">Used&nbsp;&nbsp;<b>{entry.usage}</b></div>
                  </div>
                  {expanded && (
                    <div className="control-panel-row-expanded">
                      <div className="control-panel-row-tagline">{entry.data.tagline}</div>
                      <div className="control-panel-row-details">
                        <div>
                          <span className="muted">Publisher:</span> {entry.data.publisher}
                        </div>
                        <div>
                          <span className="muted">Version:</span> {entry.data.version}
                        </div>
                        <div>
                          <span className="muted">Installed:</span> {entry.installDate}
                        </div>
                        <div>
                          <a
                            className="control-panel-support"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openWizard(entry);
                            }}
                          >
                            Click here for support information
                          </a>
                        </div>
                      </div>
                      <div className="control-panel-row-actions">
                        <div className="control-panel-row-hint">
                          To open this program's project page, click <b>Open</b>.
                        </div>
                        <button
                          className="control-panel-button primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWizard(entry);
                          }}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {visible.length === 0 && (
              <div className="control-panel-empty">
                No programs match "{query}".
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default ControlPanel;
