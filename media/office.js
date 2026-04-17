// @ts-check
// noqa: secret
var vscode = acquireVsCodeApi();
var currentAgents = {};
var eventCount = 0;
var completedCount = 0;
var timelineEvents = [];
var agentRoomCache = {};
var TIMELINE_WINDOW_KEY = "claudeOffice.timelineWindowMs";
var currentTimelineMs = 5 * 60 * 1000;
var lastUsage = null;

var ROOM_COLORS = {
  directors: "#eab308", backend: "#3b82f6", frontend: "#a855f7",
  qa: "#22c55e", security: "#ef4444", devops: "#f97316",
  integrations: "#06b6d4", "ai-lab": "#ec4899", lobby: "#14b8a6",
};

function getAgentIcon(agentName, room) {
  var avatarMap = window.__AGENT_AVATAR_MAP || {};
  var avatars = window.__AGENT_AVATARS || {};
  var icons = window.__ROOM_ICONS || {};

  var avatarKey = avatarMap[agentName];
  if (avatarKey && avatars[avatarKey]) return avatars[avatarKey];

  return icons[room] || icons["lobby"] || "";
}

function shortName(name) {
  return name.replace(/-specialist$/, "").replace(/-lead$/, "").replace(/^module-/, "").replace(/-/g, " ");
}

function formatTime(ts) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
  catch(e) { return ""; }
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = String(val);
}

function render() {
  // noqa: secret
  document.querySelectorAll(".room .agents").forEach(function(el) { el.innerHTML = ""; }); // noqa: secret
  document.querySelectorAll(".room").forEach(function(el) { el.classList.remove("room--active"); }); // noqa: secret

  var working = 0, done = 0, errors = 0, total = 0;
  var entries = Object.entries(currentAgents);

  for (var i = 0; i < entries.length; i++) {
    var name = entries[i][0], agent = entries[i][1];
    total++;
    if (agent.state === "working") working++;
    if (agent.state === "done") done++;
    if (agent.state === "error") errors++;

    var roomEl = document.querySelector('.room[data-room="' + agent.room + '"] .agents');
    if (!roomEl) continue;

    if (agent.state === "working") {
      var rm = roomEl.closest(".room");
      if (rm) rm.classList.add("room--active");
    }

    var el = document.createElement("div");
    el.className = "agent agent--" + agent.state;

    var tips = '<div class="tooltip-name">' + name + "</div>";
    if (agent.task) tips += '<div class="tooltip-task">' + agent.task + "</div>";
    if (agent.lastActivity) tips += '<div class="tooltip-time">' + formatTime(agent.lastActivity) + "</div>";

    el.innerHTML =
      '<span class="agent-icon">' + getAgentIcon(name, agent.room) + "</span>" +
      '<span class="agent-name">' + shortName(name) + "</span>" +
      '<div class="agent-tooltip">' + tips + "</div>";
    roomEl.appendChild(el);
  }

  setText("stat-working", working);
  setText("stat-done", done);
  setText("stat-errors", errors);
  setText("stat-total", total);
  setText("stat-completed", completedCount);

  var dot = document.querySelector(".status-dot");
  var statusText = document.getElementById("status-text");
  if (working > 0) {
    if (dot) { dot.classList.remove("status-dot--off"); dot.classList.add("status-dot--on"); }
    if (statusText) statusText.textContent = working + " active";
  } else if (total > 0) {
    if (dot) { dot.classList.remove("status-dot--on"); dot.classList.add("status-dot--off"); }
    if (statusText) statusText.textContent = "idle";
  } else {
    if (dot) { dot.classList.remove("status-dot--on"); dot.classList.add("status-dot--off"); }
    if (statusText) statusText.textContent = "offline";
  }

  renderTimeline();
}

function renderTimeline() {
  var canvas = document.getElementById("timeline");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  var W = rect.width, H = rect.height;
  ctx.clearRect(0, 0, W, H);

  if (timelineEvents.length === 0) {
    ctx.fillStyle = "#444";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("waiting for events...", W / 2, H / 2 + 3);
    return;
  }

  var now = Date.now();
  var windowMs = currentTimelineMs;
  var startTime = now - windowMs;

  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(0, 2, W, H - 4);

  var activeSpans = {};
  for (var i = 0; i < timelineEvents.length; i++) {
    var ev = timelineEvents[i];
    if (ev.event === "agent_start") {
      activeSpans[ev.agent] = { start: ev.ts, room: ev.room };
    } else if (ev.event === "agent_stop" && activeSpans[ev.agent]) {
      drawSpan(ctx, W, H, startTime, now, activeSpans[ev.agent].start, ev.ts, activeSpans[ev.agent].room, false);
      delete activeSpans[ev.agent];
    }
  }
  var keys = Object.keys(activeSpans);
  for (var j = 0; j < keys.length; j++) {
    var s = activeSpans[keys[j]];
    drawSpan(ctx, W, H, startTime, now, s.start, now, s.room, true);
  }

  drawTimelineGrid(ctx, W, H, windowMs);
}

function drawTimelineGrid(ctx, W, H, windowMs) {
  ctx.fillStyle = "#555";
  ctx.font = "7px sans-serif";
  ctx.textAlign = "center";

  var totalMin = windowMs / 60000;
  var step, unit;
  if (totalMin <= 5) { step = 1; unit = "m"; }
  else if (totalMin <= 15) { step = 3; unit = "m"; }
  else if (totalMin <= 30) { step = 5; unit = "m"; }
  else if (totalMin <= 60) { step = 15; unit = "m"; }
  else { step = 60; unit = "h"; }

  for (var elapsed = step; elapsed < totalMin; elapsed += step) {
    var x = (elapsed / totalMin) * W;
    ctx.fillRect(x, 0, 0.5, H);
    var remaining = totalMin - elapsed;
    var label = unit === "h" ? "-" + Math.round(remaining / 60) + "h" : "-" + Math.round(remaining) + "m";
    ctx.fillText(label, x, H - 1);
  }
}

function drawSpan(ctx, W, H, startTime, now, spanStart, spanEnd, room, active) {
  var windowMs = now - startTime;
  var x1 = Math.max(0, ((spanStart - startTime) / windowMs) * W);
  var x2 = Math.min(W, ((spanEnd - startTime) / windowMs) * W);
  if (x2 <= 0 || x1 >= W) return;
  ctx.fillStyle = ROOM_COLORS[room] || "#888";
  ctx.globalAlpha = active ? 0.8 : 0.5;
  ctx.fillRect(x1, 3, Math.max(x2 - x1, 2), H - 6);
  ctx.globalAlpha = 1;
}

function addLogEntry(agent, event, task, room) {
  var log = document.getElementById("event-log");
  if (!log) return;
  eventCount++;
  var countEl = document.getElementById("log-count");
  if (countEl) countEl.textContent = eventCount + " events";

  var isStart = event === "agent_start";
  var isError = event === "agent_stop" && task === "ERROR";
  var cls = isStart ? "start" : isError ? "error" : "stop";
  var arrow = isStart ? "▶" : isError ? "✖" : "✔";
  var label = task && task !== "ERROR" ? shortName(agent) + ": " + task : shortName(agent);
  var time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (!isStart && !isError) completedCount++;

  var r = room || agentRoomCache[agent] || "lobby";
  agentRoomCache[agent] = r;
  timelineEvents.push({ ts: Date.now(), agent: agent, event: event, room: r });

  var entry = document.createElement("div");
  entry.className = "event-log-entry event-log-entry--" + cls;
  entry.textContent = time + "  " + arrow + "  " + label;
  log.appendChild(entry);

  while (log.children.length > 50) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}

var historyLoaded = false;

window.addEventListener("message", function(evt) { // noqa: secret
  var msg = evt.data;
  if (msg.type === "full_state") {
    var entries = Object.entries(msg.agents);
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i][0], agent = entries[i][1];
      var prev = currentAgents[name];
      agentRoomCache[name] = agent.room;
      if (!prev && agent.state === "working") {
        addLogEntry(name, "agent_start", agent.task, agent.room);
      } else if (prev && prev.state !== agent.state) {
        if (agent.state === "working") addLogEntry(name, "agent_start", agent.task, agent.room);
        else if (agent.state === "done") addLogEntry(name, "agent_stop", agent.task, agent.room);
        else if (agent.state === "error") addLogEntry(name, "agent_stop", "ERROR", agent.room);
      }
    }
    currentAgents = msg.agents;
    render();
  } else if (msg.type === "usage_update") {
    lastUsage = msg.data;
    renderUsage();
  } else if (msg.type === "usage_error") {
    renderUsageError(msg.message);
  }
});

function initTimelineSelector() {
  var sel = document.getElementById("timeline-window");
  if (!sel) return;
  try {
    var saved = localStorage.getItem(TIMELINE_WINDOW_KEY);
    if (saved) {
      var n = parseInt(saved, 10);
      if (!isNaN(n) && n > 0) currentTimelineMs = n;
    }
  } catch(e) { /* localStorage unavailable */ }
  sel.value = String(currentTimelineMs);
  sel.addEventListener("change", function() {
    var n = parseInt(sel.value, 10);
    if (!isNaN(n) && n > 0) {
      currentTimelineMs = n;
      try { localStorage.setItem(TIMELINE_WINDOW_KEY, String(n)); } catch(e) {}
      renderTimeline();
    }
  });
}

function formatUsd(n) {
  if (n == null || isNaN(n)) return "\u2014";
  if (n < 1) return "$" + n.toFixed(2);
  if (n < 100) return "$" + n.toFixed(2);
  return "$" + n.toFixed(0);
}

function formatDuration(mins) {
  if (mins == null || isNaN(mins)) return "";
  if (mins < 60) return Math.round(mins) + "m";
  var h = Math.floor(mins / 60), m = Math.round(mins % 60);
  return h + "h" + (m > 0 ? " " + m + "m" : "");
}

function updateBar(kind, cost, limit, subtitle) {
  var bar = document.querySelector('.usage-bar[data-kind="' + kind + '"]');
  if (!bar) return;
  var fill = bar.querySelector(".usage-bar-fill");
  var value = bar.querySelector(".usage-bar-value");
  var pct = 0;
  if (limit && limit > 0) pct = Math.min(100, (cost / limit) * 100);
  if (fill) {
    fill.style.width = pct.toFixed(1) + "%";
    fill.classList.remove("usage-bar-fill--warn", "usage-bar-fill--crit");
    if (pct >= 90) fill.classList.add("usage-bar-fill--crit");
    else if (pct >= 70) fill.classList.add("usage-bar-fill--warn");
  }
  if (value) {
    var txt = formatUsd(cost);
    if (limit && limit > 0) txt += " / " + formatUsd(limit) + " (" + pct.toFixed(0) + "%)";
    if (subtitle) txt += "  \u00b7  " + subtitle;
    value.textContent = txt;
  }
}

function renderUsage() {
  if (!lastUsage) return;
  var u = lastUsage;
  var upd = document.getElementById("usage-updated");
  if (upd) upd.textContent = "updated " + formatTime(u.fetchedAt);

  var blockSubtitle = "";
  if (u.block) {
    if (u.block.isActive && u.block.remainingMinutes != null) {
      blockSubtitle = formatDuration(u.block.remainingMinutes) + " left";
    } else if (!u.block.isActive) {
      blockSubtitle = "no active block";
    }
  }
  updateBar("block", u.block ? u.block.costUSD : 0, u.limits.block, blockSubtitle);
  updateBar("weekly", u.weekly ? u.weekly.totalCost : 0, u.limits.weekly, "");
  updateBar("weekly-opus", u.weekly ? u.weekly.opusCost : 0, u.limits.weeklyOpus, "");
}

function renderUsageError(message) {
  var upd = document.getElementById("usage-updated");
  if (upd) upd.textContent = "error: " + message;
}

initTimelineSelector();
vscode.postMessage({ type: "webview_ready" });
setInterval(function() { renderTimeline(); }, 2000);
