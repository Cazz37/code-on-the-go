const DEFAULT_PALETTE = ['#7c3aed', '#3b82f6', '#f8fafc', '#111827'];

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function rgbToHex(red, green, blue) {
  return '#' + [red, green, blue]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('');
}

function hexToRgb(hex) {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
  ];
}

function colourDistance(first, second) {
  return Math.sqrt(
    ((first[0] - second[0]) ** 2) +
    ((first[1] - second[1]) ** 2) +
    ((first[2] - second[2]) ** 2)
  );
}

function colourProperties(red, green, blue) {
  const channels = [red, green, blue].map((value) => value / 255);
  const maximum = Math.max(...channels);
  const minimum = Math.min(...channels);
  const lightness = (maximum + minimum) / 2;
  const difference = maximum - minimum;
  const saturation = difference === 0
    ? 0
    : difference / (1 - Math.abs((2 * lightness) - 1));

  return { lightness, saturation };
}

function buildHistogram(pixels) {
  const buckets = new Map();

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 210) continue;
    const red = clamp(Math.round(pixels[index] / 24) * 24, 0, 255);
    const green = clamp(Math.round(pixels[index + 1] / 24) * 24, 0, 255);
    const blue = clamp(Math.round(pixels[index + 2] / 24) * 24, 0, 255);
    const key = `${red},${green},${blue}`;
    const current = buckets.get(key) ?? { count: 0, red, green, blue };
    current.count += 1;
    buckets.set(key, current);
  }

  return [...buckets.values()].map((entry) => ({
    ...entry,
    ...colourProperties(entry.red, entry.green, entry.blue),
    hex: rgbToHex(entry.red, entry.green, entry.blue)
  }));
}

function firstDifferent(entries, existing, fallback) {
  const selected = entries.find((entry) =>
    existing.every((colour) => colourDistance(
      [entry.red, entry.green, entry.blue],
      hexToRgb(colour)
    ) > 52)
  );
  return selected?.hex ?? fallback;
}

export function extractReferencePalette(pixels) {
  const entries = buildHistogram(pixels);
  if (!entries.length) return [...DEFAULT_PALETTE];

  const accents = entries
    .filter((entry) => entry.saturation >= 0.28 && entry.lightness >= 0.16 && entry.lightness <= 0.88)
    .sort((left, right) => {
      const leftScore = left.count * (0.45 + (left.saturation * 4.2));
      const rightScore = right.count * (0.45 + (right.saturation * 4.2));
      return rightScore - leftScore;
    });
  const backgrounds = entries
    .filter((entry) => entry.lightness >= 0.58)
    .sort((left, right) => right.count - left.count);
  const darks = entries
    .filter((entry) => entry.lightness <= 0.42)
    .sort((left, right) => right.count - left.count);
  const byFrequency = [...entries].sort((left, right) => right.count - left.count);

  const palette = [];
  palette.push(firstDifferent(accents, palette, DEFAULT_PALETTE[0]));
  palette.push(firstDifferent(accents.slice(1).concat(byFrequency), palette, DEFAULT_PALETTE[1]));
  palette.push(firstDifferent(backgrounds.concat(byFrequency), palette, DEFAULT_PALETTE[2]));
  palette.push(firstDifferent(darks.concat(byFrequency), palette, DEFAULT_PALETTE[3]));
  return palette;
}

function normalizedRect(component, width, height) {
  return {
    x: Number((component.minimumX / width).toFixed(4)),
    y: Number((component.minimumY / height).toFixed(4)),
    width: Number(((component.maximumX - component.minimumX + 1) / width).toFixed(4)),
    height: Number(((component.maximumY - component.minimumY + 1) / height).toFixed(4)),
    confidence: Number(component.confidence.toFixed(2))
  };
}

function findPrimaryAction(pixels, width, height, accentHex) {
  const accent = hexToRgb(accentHex);
  const mask = new Uint8Array(width * height);

  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += 1) {
    const offset = pixelIndex * 4;
    if (pixels[offset + 3] < 210) continue;
    const colour = [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    const { saturation, lightness } = colourProperties(...colour);
    if (
      saturation >= 0.32 &&
      lightness >= 0.14 &&
      lightness <= 0.9 &&
      colourDistance(colour, accent) <= 82
    ) {
      mask[pixelIndex] = 1;
    }
  }

  const queue = new Int32Array(width * height);
  const candidates = [];
  const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start]) continue;
    let queueStart = 0;
    let queueEnd = 1;
    queue[0] = start;
    mask[start] = 0;
    let count = 0;
    let minimumX = width;
    let maximumX = 0;
    let minimumY = height;
    let maximumY = 0;

    while (queueStart < queueEnd) {
      const current = queue[queueStart];
      queueStart += 1;
      const x = current % width;
      const y = Math.floor(current / width);
      count += 1;
      minimumX = Math.min(minimumX, x);
      maximumX = Math.max(maximumX, x);
      minimumY = Math.min(minimumY, y);
      maximumY = Math.max(maximumY, y);

      neighbours.forEach(([deltaX, deltaY]) => {
        const nextX = x + deltaX;
        const nextY = y + deltaY;
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) return;
        const next = (nextY * width) + nextX;
        if (!mask[next]) return;
        mask[next] = 0;
        queue[queueEnd] = next;
        queueEnd += 1;
      });
    }

    const boxWidth = maximumX - minimumX + 1;
    const boxHeight = maximumY - minimumY + 1;
    const widthRatio = boxWidth / width;
    const heightRatio = boxHeight / height;
    const fill = count / (boxWidth * boxHeight);
    const aspectRatio = boxWidth / Math.max(1, boxHeight);

    if (
      widthRatio >= 0.08 &&
      heightRatio >= 0.012 &&
      heightRatio <= 0.2 &&
      aspectRatio >= 1.8 &&
      fill >= 0.28
    ) {
      const confidence = clamp(
        0.42 + (fill * 0.32) + (Math.min(widthRatio, 0.45) * 0.42),
        0,
        0.99
      );
      candidates.push({
        minimumX,
        maximumX,
        minimumY,
        maximumY,
        confidence,
        score: boxWidth * boxHeight * fill * (aspectRatio >= 3 ? 1.5 : 1)
      });
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0] ? normalizedRect(candidates[0], width, height) : null;
}

function buildEdgeProfile(pixels, width, height, axis) {
  const length = axis === 'horizontal' ? height : width;
  const breadth = axis === 'horizontal' ? width : height;
  const profile = new Array(length).fill(0);

  for (let position = 1; position < length; position += 1) {
    let total = 0;
    for (let cross = 0; cross < breadth; cross += 1) {
      const currentX = axis === 'horizontal' ? cross : position;
      const currentY = axis === 'horizontal' ? position : cross;
      const previousX = axis === 'horizontal' ? cross : position - 1;
      const previousY = axis === 'horizontal' ? position - 1 : cross;
      const currentOffset = ((currentY * width) + currentX) * 4;
      const previousOffset = ((previousY * width) + previousX) * 4;
      total += colourDistance(
        [pixels[currentOffset], pixels[currentOffset + 1], pixels[currentOffset + 2]],
        [pixels[previousOffset], pixels[previousOffset + 1], pixels[previousOffset + 2]]
      );
    }
    profile[position] = total / breadth;
  }
  return profile;
}

function selectGuides(profile) {
  const mean = profile.reduce((total, value) => total + value, 0) / Math.max(1, profile.length);
  const variance = profile.reduce((total, value) => total + ((value - mean) ** 2), 0) /
    Math.max(1, profile.length);
  const threshold = mean + (Math.sqrt(variance) * 0.72);
  const minimumGap = Math.max(2, Math.round(profile.length * 0.045));
  const peaks = profile
    .map((value, index) => ({ value, index }))
    .filter(({ value, index }) =>
      index > profile.length * 0.02 &&
      index < profile.length * 0.98 &&
      value >= threshold &&
      value >= (profile[index - 1] ?? 0) &&
      value >= (profile[index + 1] ?? 0)
    )
    .sort((left, right) => right.value - left.value);
  const selected = [];

  peaks.forEach((peak) => {
    if (selected.length >= 6) return;
    if (selected.every((existing) => Math.abs(existing.index - peak.index) >= minimumGap)) {
      selected.push(peak);
    }
  });

  return selected
    .sort((left, right) => left.index - right.index)
    .map(({ index }) => Number((index / profile.length).toFixed(4)));
}

export function analyseReferencePixels(pixels, width, height) {
  if (!pixels || !width || !height || pixels.length < width * height * 4) {
    throw new Error('A complete RGBA pixel buffer is required.');
  }

  const palette = extractReferencePalette(pixels);
  const horizontalGuides = selectGuides(buildEdgeProfile(pixels, width, height, 'horizontal'));
  const verticalGuides = selectGuides(buildEdgeProfile(pixels, width, height, 'vertical'));

  return {
    palette,
    layout: {
      aspectRatio: Number((width / height).toFixed(4)),
      orientation: width === height ? 'square' : width > height ? 'landscape' : 'portrait',
      horizontalGuides,
      verticalGuides,
      measuredRegions: (horizontalGuides.length + 1) * (verticalGuides.length + 1)
    },
    primaryAction: findPrimaryAction(pixels, width, height, palette[0])
  };
}
