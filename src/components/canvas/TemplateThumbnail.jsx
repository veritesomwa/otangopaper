import { TemplateCanvas, PAGE_WIDTH, PAGE_HEIGHT } from './TemplateCanvas.jsx';

/**
 * A scaled, non-interactive preview of a template. Used in the dashboard
 * gallery, the right-panel template switcher, and the onboarding modal.
 */
export function TemplateThumbnail({ template, scale = 0.235 }) {
  return (
    <div style={{
      width:  Math.round(PAGE_WIDTH  * scale),
      height: Math.round(PAGE_HEIGHT * scale),
      overflow: 'hidden', position: 'relative', borderRadius: 0,
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
      }}>
        <TemplateCanvas template={template} readOnly />
      </div>
    </div>
  );
}
