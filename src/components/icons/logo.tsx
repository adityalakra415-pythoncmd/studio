import * as React from "react"
import { SVGProps } from "react"

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 17.5C14.5 19.433 16.067 21 18 21" />
    <path d="M12 9.5C12 11.433 10.433 13 8.5 13H5.5C3.567 13 2 11.433 2 9.5V6.5C2 4.567 3.567 3 5.5 3H8.5C10.433 3 12 4.567 12 6.5V9.5Z" />
    <path d="M10 13L14 21" />
    <path d="M22 5C22 5 20 7 18 7C16 7 14 5 14 5" />
    <path d="M12 6.5H2" />
    <path d="M12 9.5H2" />
  </svg>
)
