export function getPlayerNames(localPlayers) {
  return localPlayers.map((player, index) => {
    const typed = (player.name ?? "").trim();
    const fallback = (player.tag ?? "").trim() || `Player ${index + 1}`;
    return (typed || fallback).slice(0, 100);
  });
}

// Convert server players into the shape the existing components expect.
// Client-only fields (id, avatar, tag, pig_index) are kept from localPlayers,
// matched by position, because the server does not store them.
export function toUiPlayers(serverPlayers, localPlayers = []) {
  return [...serverPlayers]
    .sort((a, b) => a.player_index - b.player_index)
    .map((sp) => {
      const local = localPlayers[sp.player_index] ?? {};
      return {
        // client-only fields
        id: local.id ?? `server-${sp.id}`,
        avatar: local.avatar,
        tag: local.tag,
        pig_index: local.pig_index ?? sp.player_index,
        // server fields, renamed to the names the UI already uses
        name: sp.name,
        running_points: sp.turn_score,
        total_points: sp.total_score,
        // power-up fields (the server is the source of truth)
        server_id: sp.id,
        shield_active: sp.shield_active ?? false,
        double_active: sp.double_active ?? false,
        skip_next_turn: sp.skip_next_turn ?? false,
        powerups: sp.powerups ?? [],
      };
    });
}