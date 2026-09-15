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
  referenceModes,
  stylePresets,
  targetOptions
} from './catalog.js';
import { compileBlueprint, inferBlueprint } from './engine.js';
import { analyseReferencePixels } from './imageMapper.js';
import './vibecore.css';

const maximumReferenceBytes = 5 * 1024 * 1024;
const maximumEmbeddedCharacters = 620000;

function dataUrlBytes(dataUrl) {
  const base64 = String(dataUrl).split(',')[1] ?? '';
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function fingerprintReference(dataUrl) {
  let hash = 2166136261;
  for (let index = 0; index < dataUrl.length; index += 1) {
    hash ^= dataUrl.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 'fnv1a-' + (hash >>> 0).toString(16).padStart(8, '0');
}

function optimizeReferenceAsset(image, originalDataUrl) {
  if (originalDataUrl.length <= maximumEmbeddedCharacters) {
    return { dataUrl: originalDataUrl, originalPreserved: true };
  }

  let scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
  let quality = 0.9;
  let bestDataUrl = originalDataUrl;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const candidate = canvas.toDataURL('image/webp', quality);
    if (candidate.length < bestDataUrl.length) bestDataUrl = candidate;
    if (candidate.length <= maximumEmbeddedCharacters) break;
    if (quality > 0.68) {
      quality -= 0.08;
    } else {
      scale *= 0.82;
    }
  }

  return { dataUrl: bestDataUrl, originalPreserved: false };
}

function readReferenceImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That image format could not be opened.'));
      image.onload = () => {
        const scale = Math.min(1, 220 / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, width, height);
        const analysis = analyseReferencePixels(
          context.getImageData(0, 0, width, height).data,
          width,
          height
        );
        analysis.layout.aspectRatio = Number((image.naturalWidth / image.naturalHeight).toFixed(4));
        analysis.layout.orientation = image.naturalWidth === image.naturalHeight
          ? 'square'
          : image.naturalWidth > image.naturalHeight
            ? 'landscape'
            : 'portrait';
        const embedded = optimizeReferenceAsset(image, reader.result);
        const mimeType = embedded.dataUrl.slice(5, embedded.dataUrl.indexOf(';'));
        resolve({
          name: file.name,
          width: image.naturalWidth,
          height: image.naturalHeight,
          palette: analysis.palette,
          analysis,
          dataUrl: embedded.dataUrl,
          originalPreserved: embedded.originalPreserved,
          sourceBytes: file.size,
          embeddedBytes: dataUrlBytes(embedded.dataUrl),
          fingerprint: fingerprintReference(embedded.dataUrl),
          mimeType
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
  const [referenceMode, setReferenceMode] = React.useState(
    () => workspace.vibecore?.blueprint?.reference?.mode ?? 'exact'
  );
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
    setMessage('Measuring colours, geometry, and action regions on this device...');
    try {
      const analysed = await readReferenceImage(file);
      setReference(analysed);
      setReferenceMode('exact');
      setUseReferencePalette(true);
      setMessage(
        'Reference ready: ' +
        analysed.analysis.layout.measuredRegions +
        ' layout regions measured and the complete image prepared for exact matching.' +
        (analysed.originalPreserved ? '' : ' A storage-safe copy was created for this large image.')
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
    setMessage(
      reference && referenceMode === 'exact'
        ? 'Embedding the complete reference and aligning its measured interactions...'
        : 'Applying component and software rules...'
    );
    try {
      const nextCompilation = compileBlueprint({
        ...form,
        palette: reference && useReferencePalette ? reference.palette : [],
        reference: reference
          ? {
              name: reference.name,
              width: reference.width,
              height: reference.height,
              palette: useReferencePalette ? reference.palette : [],
              mode: referenceMode,
              dataUrl: reference.dataUrl,
              mimeType: reference.mimeType,
              fingerprint: reference.fingerprint,
              originalPreserved: reference.originalPreserved,
              embeddedBytes: reference.embeddedBytes,
              analysis: reference.analysis
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
  const previewReference = reference ?? compilation?.blueprint?.reference;
  const exactReferenceBuild = compilation?.blueprint?.reference?.mode === 'exact';

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
            <small>Exact-image matching or editable style extraction.</small>
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
            <ChoiceGroup
              label="Reference treatment"
              value={referenceMode}
              options={referenceModes}
              onChange={setReferenceMode}
            />
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
            <div className="vc-reference-measurements">
              <span>{reference.analysis.layout.measuredRegions} regions</span>
              <span>{reference.analysis.layout.orientation}</span>
              <span>{reference.analysis.primaryAction ? 'action found' : 'visual only'}</span>
            </div>
            <p>
              {referenceMode === 'exact'
                ? 'Exact Pixels preserves the complete attached image—including its photos, logo, colours, text, and layout—and keeps its original aspect ratio. Detected controls receive aligned interactive areas.'
                : 'Editable Layout uses the detected colours with reusable VibeCore components instead of embedding the complete image.'}
            </p>
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
        {busy
          ? 'Working locally...'
          : reference && referenceMode === 'exact'
            ? 'Build exact reference'
            : 'Compile blueprint'}
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
            <article><strong>{compilation.summary.fidelity}</strong><span>fidelity</span></article>
          </div>

          <div className="vc-builder-preview">
            <div className="vc-builder-preview-bar">
              <span>
                <Smartphone size={14} />
                {exactReferenceBuild ? 'Exact reference preview' : 'Live preview'}
              </span>
              {reference && !exactReferenceBuild && (
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
            <div
              className={'vc-preview-layers ' + (previewReference ? 'has-reference-ratio' : '')}
              style={previewReference
                ? { aspectRatio: `${previewReference.width} / ${previewReference.height}` }
                : undefined}
            >
              {previewHtml && (
                <iframe
                  title={compilation.blueprint.name + ' VibeCore preview'}
                  sandbox="allow-scripts allow-forms"
                  srcDoc={previewHtml}
                />
              )}
              {reference && !exactReferenceBuild && overlayOpacity > 0 && (
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
        <p><strong>VibeCore image mapper:</strong> Exact Pixels retains the complete visual reference at the measured ratio. Editable Layout continues to build from registered recipes and reusable parts.</p>
      </aside>
    </section>
  );
}
