type P = { size?: number };

export const PenIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M227.31 73.37 182.63 28.68a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63ZM92.69 208H48v-44.69l88-88L180.69 120ZM192 108.68 147.31 64l24-24L216 84.68Z" />
  </svg>
);

export const ChevronLeft = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const CheckIcon = ({ size = 11 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183 215.51 63.51a12 12 0 0 1 17 17Z" />
  </svg>
);

export const BulbIcon = ({ size = 13, color = "currentColor" }: P & { color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M88 232h80" />
    <path d="M78.7 167A79.5 79.5 0 0 1 48 104.5C47.8 61.1 82.7 25 126.1 24a80 80 0 0 1 51.3 143A24.3 24.3 0 0 0 168 186v6a8 8 0 0 1-8 8H96a8 8 0 0 1-8-8v-6a24.1 24.1 0 0 0-9.3-19z" />
  </svg>
);

export const LockIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16ZM96 56a32 32 0 0 1 64 0v24H96Zm112 152H48V96h160Zm-68-56a12 12 0 1 1-12-12 12 12 0 0 1 12 12Z" />
  </svg>
);

export const UnlockIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M208 80H96V56a32 32 0 0 1 61.73-11.69 8 8 0 1 0 14.83-6A48 48 0 0 0 80 56v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16Zm0 128H48V96h160Zm-68-56a12 12 0 1 1-12-12 12 12 0 0 1 12 12Z" />
  </svg>
);

export const CloseIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" aria-hidden="true">
    <path d="M200 56 56 200M200 200 56 56" />
  </svg>
);

export const CopyIcon = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinejoin="round" aria-hidden="true">
    <rect x="88" y="88" width="128" height="128" rx="8" />
    <path d="M168 88V48a8 8 0 0 0-8-8H48a8 8 0 0 0-8 8v112a8 8 0 0 0 8 8h40" />
  </svg>
);

export const ArrowLeft = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M160 208L80 128l80-80" />
  </svg>
);

export const ArrowRight = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M96 48l80 80-80 80" />
  </svg>
);

export const ShuffleIcon = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M32 72h37.7a40 40 0 0 1 32.5 16.7l51.6 72.6a40 40 0 0 0 32.5 16.7H224" />
    <path d="M200 48l24 24-24 24" />
    <path d="M200 160l24 24-24 24" />
    <path d="M146 89.6l8.2-11.6A40 40 0 0 1 186.3 64H224" />
    <path d="M32 184h37.7a40 40 0 0 0 32.5-16.7l2.7-3.9" />
  </svg>
);

export const SmallClose = ({ size = 13 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
