import { cn } from "@/lib/utils"

interface LuckyCatProps {
  className?: string
  variant?: "coral" | "cream"
}

/** Maneki-neko de Store Morena (portado del front anterior). Los colores son parte de la ilustración. */
export function LuckyCat({ className, variant = "coral" }: LuckyCatProps) {
  const body = variant === "coral" ? "#FF8585" : "#FFE8D6"
  const accent = variant === "coral" ? "#E63946" : "#F4A261"

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("size-full", className)} aria-hidden>
      <ellipse cx="100" cy="140" rx="55" ry="50" fill={body} />
      <ellipse cx="75" cy="175" rx="12" ry="8" fill={body} />
      <ellipse cx="125" cy="175" rx="12" ry="8" fill={body} />
      <circle cx="100" cy="85" r="45" fill={body} />
      <path d="M 60 65 L 50 35 L 80 50 Z" fill={body} />
      <path d="M 140 65 L 150 35 L 120 50 Z" fill={body} />
      <path d="M 65 55 L 58 40 L 75 50 Z" fill="#FFB5C5" />
      <path d="M 135 55 L 142 40 L 125 50 Z" fill="#FFB5C5" />
      <ellipse cx="55" cy="120" rx="14" ry="20" fill={body} transform="rotate(-25 55 120)" />
      <circle cx="50" cy="100" r="10" fill={body} />
      <ellipse cx="100" cy="95" rx="28" ry="22" fill="#FFFAF0" />
      <ellipse cx="88" cy="80" rx="4" ry="5" fill="#1D3557" />
      <ellipse cx="112" cy="80" rx="4" ry="5" fill="#1D3557" />
      <circle cx="89" cy="78" r="1.5" fill="white" />
      <circle cx="113" cy="78" r="1.5" fill="white" />
      <path d="M 95 92 L 100 96 L 105 92 Z" fill={accent} />
      <path
        d="M 100 96 L 100 100 M 100 100 Q 95 105 90 100 M 100 100 Q 105 105 110 100"
        stroke="#1D3557"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="60" y1="92" x2="80" y2="95" stroke="#1D3557" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="98" x2="80" y2="98" stroke="#1D3557" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="140" y1="92" x2="120" y2="95" stroke="#1D3557" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="140" y1="98" x2="120" y2="98" stroke="#1D3557" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="72" y="118" width="56" height="6" fill={accent} rx="2" />
      <circle cx="100" cy="132" r="6" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5" />
    </svg>
  )
}
