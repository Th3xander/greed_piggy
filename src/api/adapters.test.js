import { test } from "node:test";
import assert from "node:assert/strict";
import { getPlayerNames, toUiPlayers } from "./adapters.js";

test("getPlayerNames uses typed names and falls back to the pig tag", () => {
  const local = [
    { name: "  Ada ", tag: "Oink" },
    { name: "", tag: "Snort" },
    { name: "   ", tag: "" },
  ];
  assert.deepEqual(getPlayerNames(local), ["Ada", "Snort", "Player 3"]);
});

test("getPlayerNames cuts names to 100 characters", () => {
  const [name] = getPlayerNames([{ name: "x".repeat(150), tag: "Oink" }]);
  assert.equal(name.length, 100);
});

test("toUiPlayers renames score fields and keeps client-only fields", () => {
  const server = [
    {
      id: 7,
      player_index: 0,
      name: "Ada",
      total_score: 12,
      turn_score: 5,
      shield_active: true,
      double_active: false,
      skip_next_turn: false,
      powerups: [{ id: 1, type: "SHIELD" }],
    },
  ];
  const local = [{ id: "abc", avatar: "pig-0.png", tag: "Oink", pig_index: 3 }];
  const [p] = toUiPlayers(server, local);

  assert.equal(p.total_points, 12);
  assert.equal(p.running_points, 5);
  assert.equal(p.name, "Ada");
  assert.equal(p.id, "abc");
  assert.equal(p.avatar, "pig-0.png");
  assert.equal(p.tag, "Oink");
  assert.equal(p.pig_index, 3);
  assert.equal(p.shield_active, true);
  assert.deepEqual(p.powerups, [{ id: 1, type: "SHIELD" }]);
});

test("toUiPlayers sorts by player_index and defaults missing power-up fields", () => {
  const server = [
    { id: 2, player_index: 1, name: "B", total_score: 0, turn_score: 0 },
    { id: 1, player_index: 0, name: "A", total_score: 0, turn_score: 0 },
  ];
  const result = toUiPlayers(server, []);

  assert.deepEqual(result.map((p) => p.name), ["A", "B"]);
  assert.equal(result[0].shield_active, false);
  assert.deepEqual(result[0].powerups, []);
  assert.equal(result[0].id, "server-1");
});