import { generateChartColors } from "./portfolio-data"
import type { ProcessedPosition } from "./zerion-types"

// Convert percentage to SVG path
function createArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ]
    .join(" ")
}

// Convert polar coordinates to cartesian
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}

interface ChartSegment {
  position: ProcessedPosition
  startAngle: number
  endAngle: number
  color: string
}

interface SVGGenerationOptions {
  size?: number
  strokeWidth?: number
  includeBackground?: boolean
  theme?: "light" | "dark"
}

// Generate standalone SVG for donut chart
export function generateStandaloneSVG(
  positions: Array<ProcessedPosition>,
  options: SVGGenerationOptions = {},
): string {
  const {
    includeBackground = true,
    size = 280,
    strokeWidth = 45,
    theme = "light",
  } = options

  if (positions.length === 0) {
    return generateEmptySVG(size, theme)
  }

  const radius = (size - strokeWidth) / 2
  const colors = generateChartColors(positions.length)

  // Calculate segments
  let currentAngle = 0
  const segments: Array<ChartSegment> = positions.map((position, index) => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (position.percentage * 3.6) // Convert percentage to degrees
    currentAngle = endAngle

    return {
      position,
      startAngle,
      endAngle,
      color: colors[index],
    }
  })

  const svgWidth = size + 200
  const svgHeight = size + 120
  const svgCenter = svgWidth / 2
  const chartCenterY = svgHeight / 2

  // Theme colors
  const themeColors = getThemeColors(theme)

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .chart-text { 
        font-family: system-ui, -apple-system, sans-serif; 
        font-weight: 600; 
        font-size: 11px; 
        text-anchor: middle; 
        dominant-baseline: middle;
        fill: ${themeColors.text};
      }
      .center-text-small { 
        font-family: system-ui, -apple-system, sans-serif; 
        font-weight: 500; 
        font-size: 10px; 
        text-anchor: middle; 
        dominant-baseline: middle;
        fill: ${themeColors.textSecondary};
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .center-text-large { 
        font-family: system-ui, -apple-system, sans-serif; 
        font-weight: 700; 
        font-size: 16px; 
        text-anchor: middle; 
        dominant-baseline: middle;
        fill: ${themeColors.text};
      }
    </style>
  </defs>
`

  // Background
  if (includeBackground) {
    svg +=
      `  <rect width="${svgWidth}" height="${svgHeight}" fill="${themeColors.background}" rx="12"/>\n`
  }

  // Background circle
  svg +=
    `  <circle cx="${svgCenter}" cy="${chartCenterY}" r="${radius}" fill="none" stroke="${themeColors.chartBackground}" stroke-width="${strokeWidth}"/>\n`

  // Chart segments
  svg += `  <g transform="rotate(-90 ${svgCenter} ${chartCenterY})">\n`

  segments.forEach((segment) => {
    const path = createArcPath(
      svgCenter,
      chartCenterY,
      radius,
      segment.startAngle,
      segment.endAngle,
    )

    svg +=
      `    <path d="${path}" fill="none" stroke="${segment.color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>\n`
  })

  svg += `  </g>\n`

  // Labels
  segments.forEach((segment) => {
    // Only show label if segment is large enough (>3% of chart)
    const showLabel = segment.position.percentage > 3
    if (!showLabel) return

    const midAngle = (segment.startAngle + segment.endAngle) / 2
    const labelRadius = radius + strokeWidth + 25
    const labelPosition = polarToCartesian(
      svgCenter,
      chartCenterY,
      labelRadius,
      midAngle,
    )

    svg +=
      `    <text x="${labelPosition.x}" y="${labelPosition.y}" class="chart-text">${segment.position.symbol}</text>\n`
  })

  // Center content
  const centerY1 = chartCenterY - 8
  const centerY2 = chartCenterY + 8

  svg +=
    `  <text x="${svgCenter}" y="${centerY1}" class="center-text-small">Portfolio</text>\n`
  svg +=
    `  <text x="${svgCenter}" y="${centerY2}" class="center-text-large">${positions.length}+ Assets</text>\n`

  svg += `</svg>`

  return svg
}

function generateEmptySVG(size: number, theme: "light" | "dark"): string {
  const svgWidth = size + 200
  const svgHeight = size + 120
  const svgCenter = svgWidth / 2
  const chartCenterY = svgHeight / 2

  const themeColors = getThemeColors(theme)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .empty-text { 
        font-family: system-ui, -apple-system, sans-serif; 
        font-weight: 400; 
        font-size: 12px; 
        text-anchor: middle; 
        dominant-baseline: middle;
        fill: ${themeColors.textSecondary};
      }
    </style>
  </defs>
  <rect width="${svgWidth}" height="${svgHeight}" fill="${themeColors.background}" rx="12"/>
  <circle cx="${svgCenter}" cy="${chartCenterY}" r="${
    (size - 40) / 2
  }" fill="${themeColors.chartBackground}" />
  <text x="${svgCenter}" y="${chartCenterY}" class="empty-text">No positions</text>
</svg>`
}

function getThemeColors(theme: "light" | "dark") {
  if (theme === "dark") {
    return {
      background: "#1f2937", // gray-800
      chartBackground: "#374151", // gray-700
      text: "#f9fafb", // gray-50
      textSecondary: "#9ca3af", // gray-400
    }
  }

  return {
    background: "#f8fafc", // slate-50
    chartBackground: "#e2e8f0", // slate-200
    text: "#1e293b", // slate-800
    textSecondary: "#64748b", // slate-500
  }
}

// Generate data URL for sharing
export function generateSVGDataURL(
  positions: Array<ProcessedPosition>,
  options?: SVGGenerationOptions,
): string {
  const svg = generateStandaloneSVG(positions, options)
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml,${encoded}`
}

// Generate blob URL for downloading
export function generateSVGBlob(
  positions: Array<ProcessedPosition>,
  options?: SVGGenerationOptions,
): Blob {
  const svg = generateStandaloneSVG(positions, options)
  return new Blob([svg], { type: "image/svg+xml" })
}

// Copy SVG to clipboard
export async function copySVGToClipboard(
  positions: Array<ProcessedPosition>,
  options?: SVGGenerationOptions,
): Promise<boolean> {
  try {
    const svg = generateStandaloneSVG(positions, options)
    await navigator.clipboard.writeText(svg)
    return true
  } catch (error) {
    console.error("Failed to copy SVG to clipboard:", error)
    return false
  }
}
