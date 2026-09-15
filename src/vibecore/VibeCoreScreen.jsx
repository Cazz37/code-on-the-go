import React from 'react';
import {
  AlertCircle,
  Check,
  Code2,
  FileText,
  ImagePlus,
  Layers3,
  Palette,
  Play,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Upload
} from 'lucide-react';
import {
  appRecipes,
  componentCatalog,
  getRecipe,
  navigationOptions,
  stylePresets,
  targetOptions
} from './catalog.js';
import { compileBlueprint, inferBlueprint } from './engine.js';
import './vibecore.css';

const maximumReferenceBytes = 5 * 1024 * 1024;

function rgbToHex(red, green, blue) {
  return '#' + [red, green, blue]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('');
}

function colourDistance(first, second) {
  return Math.sqrt(
    ((first[0] - second[0]) ** 2) +
    ((first[1] - second[1]) ** 2) +
    ((first[2] - second[2]) ** 2)
  );
}

function extractPalette(context, width, height) {
  const pixels = context.getImageData(0, 0, width, height).data;
  const buckets = new Map();

  for (let index = 0; index < pixels.length; index += 16) {
    if (pixels[index + 3] < 210) continue;
    const red = Math.round(pixels[index] / 32) * 32;
    const green = Math.round(pixels[index + 1] / 32) * 32;
    const blue = Math.round(pixels[index + 2] / 32) * 32;
    const brightness = (red + green + blue) / 3;
    if (brightness > 244 || brightness < 18) continue;
    const key = [red, green, blue].join(',');
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const selected = [];
  [...buckets.entries()]
    .sort((left, right) => right[1] - left[1])
    .forEach(([key]) => {
      const colour = key.split(',').map(Number);
      if (selected.length < 4 && selected.every((existing) => colourDistance(existing, colour) > 66)) {
        selected.push(colour);
      }
    });

  return selected.map(([red, green, blue]) => rgbToHex(red, green, blue));
}

function readReferenceImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That image format could not be opened.'));
      image.onload = () => {
        const scale = Math.min(1, 72 / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, width, height);
        resolve({
          name: file.name,
          width: image.naturalWidth,
          height: image.naturalHeight,
          palette: extractPalette(context, width, height),
          dataUrl: reader.result
        });
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initialForm(workspace) {
  const saved = workspace.vibecore?.blueprint;
  return {
    projectName: saved?.name ?? workspace.projectName ?? 'My pocket app',
    brief: saved?.brief ?? 'Build a polished mobile dashboard with useful stats, searchable cards, and simple navigation.',
    recipe: saved?.recipe?.id ?? 'auto',
    target: saved?.target?.id ?? 'auto',
    style: saved?.style ?? 'soft',
    navigation: saved?.navigation ?? 'bottom',
    selectedComponents: saved?.components ?? getRecipe('dashboard').components
  };
}

function ChoiceGroup({ label, value, options, onChange }) {
  return (
    <fieldset className="vc-builder-fieldset">
      <legend>{label}</legend>
      <div className="vc-builder-choice-row">
        {options.map((option) => (
          <button
            className={value === option.id ? 'active' : ''}
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            <strong>{option.label}</strong>
            {option.description && <span>{option.description}</span>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RuleResult({ diagnostic }) {
  const passed = diagnostic.level === 'pass';
  return (
    <li className={'vc-rule-result ' + diagnostic.level}>
      {passed ? <Check size={15} /> : <AlertCircle size={15} />}
      <span>
        <strong>{diagnostic.code}</strong>
        {diagnostic.message}
      </span>
    </li>
  );
}

export default function VibeCoreScreen({ workspace, onCompile, onOpenFile }) {
  const [form, setForm] = React.useState(() => initialForm(workspace));
  const [reference, setReference] = React.useState(null);
  const [useReferencePalette, setUseReferencePalette] = React.useState(true);
  const [overlayOpacity, setOverlayOpacity] = React.useState(42);
  const [compilation, setCompilation] = React.useState(() => workspace.vibecore?.lastBuild ?? null);
  const [message, setMessage] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const imageInputId = React.useId();

  const updateForm = (patch) => {
    setMessage('');
    setForm((current) => ({ ...current, ...patch }));
  };

  const toggleComponent = (componentId) => {
    const selected = new Set(form.selectedComponents);
    if (selected.has(componentId)) {
      selected.delete(componentId);
    } else {
      selected.add(componentId);
    }
    updateForm({ selectedComponents: [...selected] });
  };

  const applySuggestions = () => {
    const suggested = inferBlueprint({
      ...form,
      selectedComponents: []
    });
    updateForm({
      recipe: suggested.recipe.id,
      target: suggested.target.id,
      selectedComponents: suggested.components
    });
    setMessage('The brief was matched to the closest registered recipe and components.');
  };

  const handleReference = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > maximumReferenceBytes) {
      setMessage('Use an image smaller than 5 MB.');
      return;
    }

    setBusy(true);
    setMessage('Reading image colours on this device...');
    try {
      const analysed = await readReferenceImage(file);
      setReference(analysed);
      setUseReferencePalette(true);
      setMessage(
        analysed.palette.length
          ? 'Reference loaded and its dominant colours are ready.'
          : 'Reference loaded. No strong colour palette was detected.'
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  const buildProject = async () => {
    if (!form.projectName.trim() || !form.brief.trim()) {
      setMessage('Add a project name and a clear description first.');
      return;
    }

    setBusy(true);
    setMessage('Applying component and software rules...');
    try {
      const nextCompilation = compileBlueprint({
        ...form,
        palette: reference && useReferencePalette ? reference.palette : [],
        reference: reference
          ? {
              name: reference.name,
              width: reference.width,
              height: reference.height,
              palette: useReferencePalette ? reference.palette : []
            }
          : null
      });
      const result = await onCompile(nextCompilation);
      setCompilation(nextCompilation);
      setMessage(result?.message ?? 'Blueprint compiled into project files.');
    } catch (error) {
      setMessage(error.message || 'The blueprint could not be compiled.');
    } finally {
      setBusy(false);
    }
  };

  const previewHtml = compilation?.previewHtml;
  const generatedFiles = compilation?.files ?? [];

  return (
    <section className="screen vibecore-screen">
      <div className="screen-title vc-builder-title">
        <div>
          <p className="eyebrow">VibeCore Blueprint Engine</p>
          <h2>Build with rules</h2>
        </div>
        <span className="vc-local-badge">
          <ShieldCheck size={14} />
          No AI
        </span>
      </div>

      <article className="vc-builder-intro">
        <span><Layers3 size={16} /> Deterministic builder</span>
        <h3>Describe the result. VibeCore chooses a supported structure.</h3>
        <p>Your brief is matched against local recipes, components, syntax templates, and validation rules on this device.</p>
      </article>

      <section className="vc-builder-card">
        <div className="vc-builder-section-heading">
          <span>01</span>
          <div>
            <strong>Project brief</strong>
            <small>Plain language, guided by supported rules.</small>
          </div>
        </div>

        <label className="vc-builder-field">
          <span>Project name</span>
          <input
            value={form.projectName}
            onChange={(event) => updateForm({ projectName: event.target.value })}
            placeholder="Example: Aveth Studio"
          />
        </label>
        <label className="vc-builder-field">
          <span>What should it build?</span>
          <textarea
            rows="5"
            value={form.brief}
            onChange={(event) => updateForm({ brief: event.target.value })}
            placeholder="Describe the screens, content, actions, colours, and feeling..."
          />
        </label>
        <button className="vc-suggest-button" type="button" onClick={applySuggestions}>
          <RefreshCw size={15} />
          Match brief to rules
        </button>

        <ChoiceGroup
          label="App recipe"
          value={form.recipe}
          options={[{ id: 'auto', label: 'Auto' }, ...appRecipes]}
          onChange={(recipe) => updateForm({ recipe })}
        />
        <ChoiceGroup
          label="Code target"
          value={form.target}
          options={targetOptions}
          onChange={(target) => updateForm({ target })}
        />
      </section>

      <section className="vc-builder-card">
        <div className="vc-builder-section-heading">
          <span>02</span>
          <div>
            <strong>Component library</strong>
            <small>Only tested, registered parts are generated.</small>
          </div>
        </div>
        <div className="vc-component-grid">
          {componentCatalog.map((component) => {
            const selected = form.selectedComponents.includes(component.id);
            return (
              <button
                className={selected ? 'selected' : ''}
                key={component.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleComponent(component.id)}
              >
                <span>{selected ? <Check size={14} /> : <span />}</span>
                <strong>{component.label}</strong>
                <small>{component.description}</small>
              </button>
            );
          })}
        </div>

        <ChoiceGroup
          label="Visual system"
          value={form.style}
          options={stylePresets}
          onChange={(style) => updateForm({ style })}
        />
        <div className="vc-palette-preview" aria-label="Selected colour palette">
          {stylePresets.find((preset) => preset.id === form.style)?.palette.map((colour) => (
            <span key={colour} style={{ background: colour }} title={colour} />
          ))}
        </div>
        <ChoiceGroup
          label="Navigation"
          value={form.navigation}
          options={navigationOptions}
          onChange={(navigation) => updateForm({ navigation })}
        />
      </section>

      <section className="vc-builder-card">
        <div className="vc-builder-section-heading">
          <span>03</span>
          <div>
            <strong>Reference image</strong>
            <small>Optional colour mapping and visual comparison.</small>
          </div>
        </div>

        <input
          className="vc-hidden-input"
          id={imageInputId}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleReference}
        />
        <label className="vc-reference-drop" htmlFor={imageInputId}>
          {reference ? (
            <>
              <img src={reference.dataUrl} alt="" />
              <span>
                <strong>{reference.name}</strong>
                <small>{reference.width} × {reference.height}px</small>
              </span>
              <Upload size={18} />
            </>
          ) : (
            <>
              <ImagePlus size={23} />
              <span>
                <strong>Attach a screenshot</strong>
                <small>PNG, JPG, or WebP up to 5 MB</small>
              </span>
            </>
          )}
        </label>

        {reference && (
          <div className="vc-reference-tools">
            <label className="vc-reference-toggle">
              <input
                type="checkbox"
                checked={useReferencePalette}
                onChange={(event) => setUseReferencePalette(event.target.checked)}
              />
              <span>Use detected colours</span>
            </label>
            <div className="vc-detected-palette">
              {reference.palette.map((colour) => (
                <span key={colour} style={{ background: colour }} title={colour} />
              ))}
            </div>
            <p>V0.1 extracts colours and provides an overlay. Layout-region tracing is the next image-mapper layer.</p>
          </div>
        )}
      </section>

      {message && (
        <div className="vc-builder-message" role="status">
          <SlidersHorizontal size={16} />
          <span>{message}</span>
        </div>
      )}

      <button className="vc-compile-button" type="button" onClick={buildProject} disabled={busy}>
        <Play size={18} />
        {busy ? 'Working locally...' : 'Compile blueprint'}
      </button>

      {compilation && (
        <section className="vc-build-result" aria-live="polite">
          <div className="vc-result-heading">
            <div>
              <p className="eyebrow">Compiled locally</p>
              <h3>{compilation.blueprint.name}</h3>
            </div>
            <span>{compilation.summary.passedRules}/{compilation.summary.totalRules} rules</span>
          </div>

          <div className="vc-result-metrics">
            <article><strong>{compilation.summary.recipe}</strong><span>recipe</span></article>
            <article><strong>{compilation.summary.target}</strong><span>target</span></article>
            <article><strong>{compilation.summary.components}</strong><span>components</span></article>
          </div>

          <div className="vc-builder-preview">
            <div className="vc-builder-preview-bar">
              <span><Smartphone size={14} /> Live preview</span>
              {reference && (
                <label>
                  Overlay
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlayOpacity}
                    onChange={(event) => setOverlayOpacity(Number(event.target.value))}
                  />
                </label>
              )}
            </div>
            <div className="vc-preview-layers">
              {previewHtml && (
                <iframe
                  title={compilation.blueprint.name + ' VibeCore preview'}
                  sandbox="allow-scripts allow-forms"
                  srcDoc={previewHtml}
                />
              )}
              {reference && overlayOpacity > 0 && (
                <img
                  className="vc-reference-overlay"
                  src={reference.dataUrl}
                  alt="Reference comparison overlay"
                  style={{ opacity: overlayOpacity / 100 }}
                />
              )}
            </div>
          </div>

          <div className="vc-result-actions">
            <button type="button" onClick={() => onOpenFile(compilation.primaryFile, 'code')}>
              <Code2 size={16} />
              Open code
            </button>
            <button type="button" onClick={() => onOpenFile(compilation.previewFile, 'preview')}>
              <Smartphone size={16} />
              Full preview
            </button>
          </div>

          <div className="vc-output-files">
            <span><FileText size={15} /> {generatedFiles.length} generated files</span>
            <div>
              {generatedFiles.map((file) => (
                <button key={file.path} type="button" onClick={() => onOpenFile(file.path, 'code')}>
                  {file.path}
                </button>
              ))}
            </div>
          </div>

          <div className="vc-rule-panel">
            <div><ShieldCheck size={16} /><strong>Software rule check</strong></div>
            <ul>
              {compilation.diagnostics.map((diagnostic) => (
                <RuleResult key={diagnostic.code} diagnostic={diagnostic} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <aside className="vc-engine-note">
        <Palette size={16} />
        <p><strong>What this first engine understands:</strong> phone-first web interfaces built from its registered recipes and parts. More component and language packs can be added without changing the compiler contract.</p>
      </aside>
    </section>
  );
}
