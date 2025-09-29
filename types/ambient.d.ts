declare module '@internationalized/date' {
  // Minimal ambient types to satisfy TS in this project context.
  export type DateValue = any;
  export function parseDate(value: string): any;
}
