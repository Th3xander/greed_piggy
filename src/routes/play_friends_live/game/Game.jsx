import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "src/components/Navbar";
import ErrorBanner from "src/components/ErrorBanner";
import { ERROR_CODES } from "src/constants/game";
import { useGameSession, PHASE } from "src/context/GameSessionContext";
import { useLiveGameContext } from "src/context/useLiveGameContext";
import PlayerTable from "./components/PlayerTable";
import StatsSection from "./components/StatsSection";
import GameOver from "./GameOver";
import DiceSection from "./components/DiceSection";
import StatsSectionMobile from "./components/StatsSectionMobile";
import CurrentPlayerMobile from "./components/CurrentPlayerMobile";
import DiceSectionMobile from "./components/DiceSectionMobile";

export default function LiveGame() {
  const { gameId } = useParams();
  const { setIsContinue } = useLiveGameContext();
  const { phase, session, players, activePlayer, leaderboard, error, loadGame } =
    useGameSession();

  useEffect(() => {
    setIsContinue(true);
  }, [setIsContinue]);

  // Load the game named in the URL (first visit, refresh, or a different game ID)
  useEffect(() => {
    if (gameId && gameId !== session?.id) {
      loadGame(gameId);
    }
  }, [gameId, session?.id, loadGame]);

  const hasGame = Boolean(gameId) && session?.id === gameId;
  const showError = !gameId || (!hasGame && Boolean(error));
  const showLoading = !showError && (!hasGame || phase === PHASE.LOADING);

  if (showError) {
    const title = !gameId
      ? "No game selected"
      : error?.code === ERROR_CODES.GAME_NOT_FOUND
      ? "Oops, game not found"
      : "Oops, something went wrong";
    const text = !gameId ? "Start a new game to begin playing." : error?.message;

    return (
      <div className="p-2 space-y-2">
        <Navbar />
        <div className="mx-auto mt-10 max-w-md rounded border border-[#ffffff40] bg-[#ffffff10] p-6 text-center text-white space-y-4">
          <h1 className="pri-font text-3xl text-[#FFD700]">{title}</h1>
          <p className="sec-font rounded border border-[#E71D36] bg-[#ffffff10] p-3 text-[#E71D36]">
            {text}
          </p>
          <Link
            to="/live-game/setup"
            className="inline-block w-full md:w-auto sec-font text-xl rounded px-8 py-4 bg-[#D30CBD] hover:bg-[#d30cbcc0] font-bold text-white duration-500"
          >
            Start a new game
          </Link>
        </div>
      </div>
    );
  }

  if (showLoading) {
    return (
      <div className="p-2 space-y-2">
        <Navbar />
        <div className="mx-auto mt-10 max-w-md rounded border border-[#ffffff40] bg-[#ffffff10] p-6 text-center text-white space-y-4">
          <p className="animate-pulse text-5xl">🐷</p>
          <h1 className="pri-font text-3xl">Loading game…</h1>
          <p className="sec-font text-[#F9F7E8]">Fetching your game from the server</p>
        </div>
      </div>
    );
  }

  // NOTE: the old-named props (playerData, currentPlayer) are temporary so the
  // screen doesn't crash before T3/T4/T5/T6 update the child components.
  // Remove them as each child is migrated.
  const oldPlayerIndex = activePlayer?.player_index ?? 0;

  return (
    <div className="md:grid md:grid-cols-[minmax(auto,_200px)_1fr_minmax(auto,_200px)] lg:grid-cols-[minmax(auto,_250px)_1fr_minmax(auto,_250px)] xl:grid-cols-[auto_1fr_minmax(auto,_300px)] relative">
      <DiceSection />
      <div className=" space-y-2 p-2">
        <Navbar />
        <ErrorBanner />
        <PlayerTable
          players={players}
          activePlayer={activePlayer}
          playerData={players}
          currentPlayer={oldPlayerIndex}
        />
      </div>
      <CurrentPlayerMobile
        players={players}
        activePlayer={activePlayer}
        playerData={players}
        currentPlayer={oldPlayerIndex}
      />
      <DiceSectionMobile />

      <StatsSection
        players={players}
        activePlayer={activePlayer}
        playerData={players}
        currentPlayer={oldPlayerIndex}
      />
      <StatsSectionMobile
        players={players}
        activePlayer={activePlayer}
        playerData={players}
        currentPlayer={oldPlayerIndex}
      />
      {phase === PHASE.WON ? (
        // TODO(T6): GameOver will read winner/leaderboard from useGameSession() itself.
        <GameOver
          playerData={leaderboard}
          currentPlayer={oldPlayerIndex}
          setIsContinue={setIsContinue}
        />
      ) : null}
    </div>
  );
}