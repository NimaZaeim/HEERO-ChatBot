// This is a utility function that merges class names using clsx and tailwind-merge.
// It allows for conditional class names and ensures that Tailwind CSS classes are merged correctly.
// It is useful for styling components in a React application using Tailwind CSS.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
