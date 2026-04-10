import React from 'react'

interface QCLogoProps {
  className?: string
  size?: number
  isDark?: boolean
}

export function QCLogo({ className = "", size = 24, isDark = true }: QCLogoProps) {
  const slateColor = isDark ? "#0f172a" : "#ffffff"
  const orangeColor = "#f97316"

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roofline peak accent */}
      <path
        d="M12 3 L20 9.5"
        stroke={orangeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main 'Q' body circle */}
      <circle
        cx="12"
        cy="14"
        r="7"
        stroke={slateColor}
        strokeWidth="2.2"
        fill="none"
      />

      {/* Q tail */}
      <line
        x1="16.8"
        y1="18.8"
        x2="20"
        y2="21.5"
        stroke={slateColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Roofline left side */}
      <path
        d="M4 9.5 L12 3"
        stroke={slateColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
