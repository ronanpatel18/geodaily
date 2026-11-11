import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import IconButton from './IconButton';
import Toggle from './Toggle';

export default function SettingsDropdown() {
  const { settings, updateSetting } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      <IconButton label="Settings" onClick={() => setOpen((o) => !o)}>⚙</IconButton>
      {open && (
        <div className="dropdown__panel card">
          <h4>Settings</h4>
          <div className="setting-row">
            <div>
              <div className="setting-row__title">Relaxed Mode</div>
              <div className="muted small">Disable the round timer</div>
            </div>
            <Toggle label="Relaxed mode" checked={settings.relaxed} onChange={(v) => updateSetting({ relaxed: v })} />
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-row__title">Distance units</div>
              <div className="muted small">km / miles</div>
            </div>
            <select
              className="select"
              value={settings.units}
              onChange={(e) => updateSetting({ units: e.target.value })}
              aria-label="Distance units"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
