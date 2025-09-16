import { loadInitialHeaderData } from "../store/header/headerContent";

let _started = false;
let _promise: Promise<void> | null = null;

/**
 * Loads both header and document blocks from a mock (or real) endpoint.
 * Ensures single-flight to avoid duplicate fetches during fast refresh / rerenders.
 */
export function loadAllInitialData(source = "/mock-initial-data.json") {
  if (_started && _promise) return _promise;
  _started = true;
  _promise = (async () => {
    await Promise.all([
      loadInitialHeaderData(source),
    ]);
  })();
  return _promise;
}
