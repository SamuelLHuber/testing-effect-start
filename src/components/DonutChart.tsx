import { useState } from "preact/hooks"
import { formatPercentage, generateChartColors } from "../lib/portfolio-data"
import type { ProcessedPosition } from "../lib/zerion-types"

interface DonutChartProps {
  positions: Array<ProcessedPosition>
  size?: number
  strokeWidth?: number
}

interface ChartSegment {
  position: ProcessedPosition
  startAngle: number
  endAngle: number
  color: string
}

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

export function DonutChart(
  { positions, size = 240, strokeWidth = 40 }: DonutChartProps,
) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (positions.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-base-200"
        style={{ width: size, height: size }}
      >
        <span className="text-base-content/50 text-sm">
          No positions
        </span>
      </div>
    )
  }

  const center = size / 2
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

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--b3))"
          strokeWidth={strokeWidth}
        />

        {/* Chart segments */}
        {segments.map((segment, index) => {
          const path = createArcPath(
            center,
            center,
            radius,
            segment.startAngle,
            segment.endAngle,
          )

          const isHovered = hoveredIndex === index
          const strokeWidthAdjusted = isHovered ? strokeWidth + 4 : strokeWidth

          return (
            <path
              key={segment.position.symbol}
              d={path}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidthAdjusted}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )
        })}
      </svg>

      {/* Center content - shows hovered position or total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {hoveredIndex !== null
          ? (
            <>
              <div className="text-sm font-medium text-base-content/70">
                {segments[hoveredIndex].position.symbol}
              </div>
              <div className="text-lg font-bold text-base-content">
                {formatPercentage(segments[hoveredIndex].position.percentage)}
              </div>
              <div className="text-xs text-base-content/50 max-w-20 truncate">
                {segments[hoveredIndex].position.name}
              </div>
            </>
          )
          : (
            <>
              <div className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                Portfolio
              </div>
              <div className="text-lg font-bold text-base-content">
                {positions.length} Assets
              </div>
            </>
          )}
      </div>

      {/* Tooltip for mobile */}
      {hoveredIndex !== null && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-base-300 text-base-content rounded-lg px-3 py-2 text-sm shadow-lg whitespace-nowrap md:hidden">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segments[hoveredIndex].color }}
            />
            <span className="font-medium">
              {segments[hoveredIndex].position.symbol}
            </span>
            <span>
              {formatPercentage(segments[hoveredIndex].position.percentage)}
            </span>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-base-300" />
        </div>
      )}
    </div>
  )
}
