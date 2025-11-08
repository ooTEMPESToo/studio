import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
      <path d="M18 5v14" />
      <path d="m5 12-4 4" />
      <path d="m5 12 4 4" />
      <path d="m19 12-4-4" />
      <path d="m19 12 4-4" />
    </svg>
  ),
};
