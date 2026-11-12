import resolved from './locations.json';
import { CANDIDATES } from './candidates';

/**
 * The playable pool. locations.json is written by the resolver (tools/resolve-locations.html)
 * and pins every location to one Google panorama, so all players see the same view and are
 * scored against the same point. Until it has been generated, the raw candidates are used
 * and snapped to the nearest panorama at game start.
 */
export const IS_RESOLVED = resolved.length > 0;
export const LOCATIONS = IS_RESOLVED ? resolved : CANDIDATES;
