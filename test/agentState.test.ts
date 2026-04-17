import * as assert from 'assert';
import { AgentStateStore } from '../src/agentState';
import { AgentEvent } from '../src/types';

function mkEvent(overrides: Partial<AgentEvent>): AgentEvent {
  return {
    ts: new Date().toISOString(),
    event: 'agent_start',
    agent: 'backend-lead',
    session: 'S1',
    cwd: '/home/user/projectA',
    ...overrides,
  };
}

// --- No filter: legacy global behavior (everything passes) ---

{
  const store = new AgentStateStore();
  store.processEvent(mkEvent({ cwd: '/home/user/projectA' }));
  store.processEvent(mkEvent({ agent: 'qa-lead', cwd: '/home/user/projectB' }));
  const snap = store.getSnapshot();
  assert.ok(snap['backend-lead'], 'no filter: accepts projectA');
  assert.ok(snap['qa-lead'], 'no filter: accepts projectB');
}

// --- With filter: other-project events are dropped ---

{
  const store = new AgentStateStore();
  store.setCwdFilter('/home/user/projectA');
  store.processEvent(mkEvent({ cwd: '/home/user/projectA' }));
  store.processEvent(mkEvent({ agent: 'qa-lead', cwd: '/home/user/projectB' }));
  const snap = store.getSnapshot();
  assert.ok(snap['backend-lead'], 'filter matches: projectA kept');
  assert.ok(!snap['qa-lead'], 'filter rejects: projectB dropped');
}

// --- Filter with Windows backslashes + case differences ---

{
  const store = new AgentStateStore();
  store.setCwdFilter('D:\\Code projects\\BAZA_CRM');
  store.processEvent(mkEvent({ cwd: 'd:/Code projects/BAZA_CRM' }));
  store.processEvent(mkEvent({ agent: 'qa-lead', cwd: 'D:/Code projects/Other' }));
  const snap = store.getSnapshot();
  assert.ok(snap['backend-lead'], 'normalized path match (slashes + case)');
  assert.ok(!snap['qa-lead'], 'non-matching sibling folder dropped');
}

// --- Subfolder invocation counts as a match (startsWith) ---

{
  const store = new AgentStateStore();
  store.setCwdFilter('/home/user/projectA');
  store.processEvent(mkEvent({ cwd: '/home/user/projectA/apps/crm' }));
  assert.ok(store.getSnapshot()['backend-lead'], 'subfolder cwd still matches');
}

// --- Sibling whose name prefixes ours shouldn't match (no slash boundary) ---

{
  const store = new AgentStateStore();
  store.setCwdFilter('/home/user/project');
  store.processEvent(mkEvent({ cwd: '/home/user/projectABC' }));
  assert.ok(!store.getSnapshot()['backend-lead'], 'prefix without slash boundary rejected');
}

// --- session_stop only resets agents in this store (filter is implicit) ---

{
  const storeA = new AgentStateStore();
  storeA.setCwdFilter('/home/user/projectA');
  storeA.processEvent(mkEvent({ cwd: '/home/user/projectA' }));

  // Simulate session_stop coming from ANOTHER project → dropped entirely
  storeA.processEvent({
    ts: new Date().toISOString(),
    event: 'session_stop',
    agent: '',
    session: 'S2',
    cwd: '/home/user/projectB',
  });

  assert.strictEqual(
    storeA.getSnapshot()['backend-lead'].state,
    'working',
    'session_stop from other project does not reset our agents',
  );

  // Session_stop from OUR project does reset
  storeA.processEvent({
    ts: new Date().toISOString(),
    event: 'session_stop',
    agent: '',
    session: 'S1',
    cwd: '/home/user/projectA',
  });
  assert.strictEqual(
    storeA.getSnapshot()['backend-lead'].state,
    'idle',
    'session_stop from our project resets our agents',
  );
}

// --- Event without cwd is dropped when filter is set (strict mode) ---

{
  const store = new AgentStateStore();
  store.setCwdFilter('/home/user/projectA');
  store.processEvent(mkEvent({ cwd: undefined }));
  assert.ok(
    !store.getSnapshot()['backend-lead'],
    'events without cwd dropped under filter',
  );
}

console.log('All agentState tests passed.');
