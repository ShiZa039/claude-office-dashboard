import * as assert from 'assert';
import { DEFAULT_AGENT_ROOMS, getRoomForAgent, inferRoomByName } from '../src/types';

// --- DEFAULT_AGENT_ROOMS direct hits still work ---

assert.strictEqual(getRoomForAgent('backend-lead'), 'backend', 'known backend-lead');
assert.strictEqual(getRoomForAgent('ai-lead'), 'ai-lab', 'known ai-lead');
assert.strictEqual(getRoomForAgent('product-director'), 'directors', 'known product-director');

// --- customMap overrides built-in defaults ---

const custom = { 'backend-lead': 'ai-lab', 'my-dream-agent': 'frontend' };
assert.strictEqual(getRoomForAgent('backend-lead', custom), 'ai-lab', 'custom overrides default');
assert.strictEqual(getRoomForAgent('my-dream-agent', custom), 'frontend', 'custom adds new entries');
assert.strictEqual(getRoomForAgent('qa-lead', custom), 'qa', 'untouched defaults survive custom');

// --- Heuristic fallback for unknown agents ---

assert.strictEqual(inferRoomByName('finance-director'), 'directors', 'director suffix → directors');
assert.strictEqual(inferRoomByName('graphql-backend-adapter'), 'backend', 'backend token → backend');
assert.strictEqual(inferRoomByName('react-forms-specialist'), 'frontend', 'react token → frontend');
assert.strictEqual(inferRoomByName('pytest-plugin-author'), 'qa', 'pytest token → qa');
assert.strictEqual(
  inferRoomByName('auth-hardening-specialist-v2'),
  'security',
  'auth token → security',
);
assert.strictEqual(inferRoomByName('docker-guru'), 'devops', 'docker token → devops');
assert.strictEqual(inferRoomByName('llm-evaluator'), 'ai-lab', 'llm token → ai-lab');
assert.strictEqual(inferRoomByName('telegram-bot-maintainer'), 'integrations', 'telegram → integrations');

// --- Unknown-unknowns go to lobby ---

assert.strictEqual(inferRoomByName('general-purpose'), 'lobby', 'general-purpose → lobby');
assert.strictEqual(inferRoomByName('explore'), 'lobby', 'explore → lobby');
assert.strictEqual(inferRoomByName('mystery'), 'lobby', 'unknown → lobby');

// --- Precedence: customMap > DEFAULT > heuristic ---

// Heuristic would put "docker-guru" into devops; custom moves to lobby.
assert.strictEqual(
  getRoomForAgent('docker-guru', { 'docker-guru': 'lobby' }),
  'lobby',
  'customMap beats heuristic',
);

// Custom map without the queried agent falls through to heuristic.
assert.strictEqual(
  getRoomForAgent('unknown-react-agent', { 'other-agent': 'backend' }),
  'frontend',
  'heuristic still runs when customMap does not cover the name',
);

// --- Sanity: every default mapping resolves to a known room ---

for (const [agent, room] of Object.entries(DEFAULT_AGENT_ROOMS)) {
  assert.ok(room, `room for ${agent} must be non-empty`);
}

console.log('All types tests passed.');
