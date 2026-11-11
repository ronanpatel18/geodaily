import Toggle from '../common/Toggle';
import { useApp } from '../../context/AppContext';

export default function SettingsCard() {
  const { settings, updateSetting, reset } = useApp();
  const onReset = () => {
    if (window.confirm('Reset all local stats? This cannot be undone.')) reset();
  };
  return (
    <section className="card">
      <h3>⚙ Settings</h3>
      <div className="setting-row">
        <div>
          <div className="setting-row__title">Relaxed Mode (No Timers)</div>
          <div className="muted small">Hide the timer; no speed bonus</div>
        </div>
        <Toggle label="Relaxed mode" checked={settings.relaxed} onChange={(v) => updateSetting({ relaxed: v })} />
      </div>
      <div className="setting-row">
        <div>
          <div className="setting-row__title">Distance Units</div>
          <div className="muted small">Kilometers vs. miles</div>
        </div>
        <div className="row">
          <span className={settings.units === 'km' ? 'strong' : 'muted'}>km</span>
          <Toggle label="Use miles" checked={settings.units === 'mi'} onChange={(v) => updateSetting({ units: v ? 'mi' : 'km' })} />
          <span className={settings.units === 'mi' ? 'strong' : 'muted'}>mi</span>
        </div>
      </div>
      <hr />
      <p className="muted small">Stats are stored in localStorage. Clearing browser data resets them.</p>
      <button type="button" className="btn btn--outline" onClick={onReset}>Reset local stats</button>
    </section>
  );
}
