import * as assert from 'assert';
import { parseLine, parseLines } from '../src/eventParser';

// --- parseLine ---

// Valid agent_start // noqa: secret
const startJson = '{"ts":"2026-04-16T14:00:00.000Z",' // noqa: secret
  + '"event":"agent_start","agent":"backend-lead","task":"writing models","session":"abc123"}';
const start = parseLine(startJson);
assert.ok(start, 'should parse valid agent_start');
assert.strictEqual(start!.event, 'agent_start');
assert.strictEqual(start!.agent, 'backend-lead');
assert.strictEqual(start!.session, 'abc123');

// Valid agent_stop // noqa: secret
const stopJson = '{"ts":"2026-04-16T14:00:05.000Z",' // noqa: secret
  + '"event":"agent_stop","agent":"qa-lead","result":"success","session":"abc123"}';
const stop = parseLine(stopJson);
assert.ok(stop, 'should parse valid agent_stop');
assert.strictEqual(stop!.event, 'agent_stop');
assert.strictEqual(stop!.result, 'success');

// Valid session_stop
const sessionJson = '{"ts":"2026-04-16T14:00:12.000Z","event":"session_stop","session":"abc123"}';
const sessionStop = parseLine(sessionJson);
assert.ok(sessionStop, 'should parse session_stop');
assert.strictEqual(sessionStop!.event, 'session_stop');

// Empty line
assert.strictEqual(parseLine(''), null, 'empty line -> null');
assert.strictEqual(parseLine('   '), null, 'whitespace -> null');

// Invalid JSON
assert.strictEqual(parseLine('{broken'), null, 'broken JSON -> null');

// Missing required fields
assert.strictEqual(parseLine('{"event":"agent_start"}'), null, 'missing session -> null');
assert.strictEqual(parseLine('{"session":"abc"}'), null, 'missing event -> null');

// --- parseLines ---

const line1 = '{"ts":"T1","event":"agent_start","agent":"a","session":"s1"}';
const line2 = '{"ts":"T2","event":"agent_stop","agent":"a","result":"success","session":"s1"}';
const multiline = [line1, '', '{bad json}', line2].join('\n');

const events = parseLines(multiline);
assert.strictEqual(events.length, 2, 'should parse 2 valid events from 4 lines');
assert.strictEqual(events[0].event, 'agent_start');
assert.strictEqual(events[1].event, 'agent_stop');

// Empty input
assert.strictEqual(parseLines('').length, 0, 'empty string -> 0 events');

console.log('All eventParser tests passed.');
