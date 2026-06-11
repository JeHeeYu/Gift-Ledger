import type { SVGProps } from 'react'

export type AppIconName =
  | 'chart'
  | 'check'
  | 'download'
  | 'edit'
  | 'plus'
  | 'printer'
  | 'search'
  | 'trash'
  | 'users'
  | 'wallet'
  | 'x'

type AppIconProps = {
  name: AppIconName
  size?: number
} & Omit<SVGProps<SVGSVGElement>, 'children'>

const ICON_PATHS: Record<AppIconName, string[]> = {
  chart: ['M4 19V5', 'M4 19H20', 'M8 16V11', 'M13 16V7', 'M18 16V10'],
  check: ['M20 6L9 17L4 12'],
  download: [
    'M12 3V15',
    'M7 10L12 15L17 10',
    'M5 21H19',
  ],
  edit: [
    'M12 20H21',
    'M16.5 3.5A2.12 2.12 0 0 1 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z',
  ],
  plus: ['M12 5V19', 'M5 12H19'],
  printer: [
    'M7 8V3H17V8',
    'M7 17H5A2 2 0 0 1 3 15V10A2 2 0 0 1 5 8H19A2 2 0 0 1 21 10V15A2 2 0 0 1 19 17H17',
    'M7 14H17V21H7V14Z',
  ],
  search: ['M21 21L15.8 15.8', 'M11 18A7 7 0 1 0 11 4A7 7 0 0 0 11 18Z'],
  trash: [
    'M3 6H21',
    'M8 6V4H16V6',
    'M19 6L18 20H6L5 6',
    'M10 11V16',
    'M14 11V16',
  ],
  users: [
    'M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21',
    'M9 11A4 4 0 1 0 9 3A4 4 0 0 0 9 11Z',
    'M22 21V19A4 4 0 0 0 19 15.13',
    'M16 3.13A4 4 0 0 1 16 10.87',
  ],
  wallet: [
    'M19 7V5A2 2 0 0 0 17 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9A2 2 0 0 0 19 7H7A2 2 0 0 1 5 5',
    'M16 14H16.01',
  ],
  x: ['M18 6L6 18', 'M6 6L18 18'],
}

const AppIcon = ({
  name,
  size = 18,
  strokeWidth = 2,
  ...svgProps
}: AppIconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...svgProps}
    >
      {ICON_PATHS[name].map((path) => (
        <path
          d={path}
          key={path}
        />
      ))}
    </svg>
  )
}

export default AppIcon
