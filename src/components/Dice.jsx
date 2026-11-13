import { useEffect, useRef, useState } from "react";
import { useGreedyPigContext } from "src/context/useGreedyPigContext";
import { useLiveGameContext } from "src/context/useLiveGameContext";
import { useGameSession, PHASE } from "src/context/GameSessionContext";
import { DIE_FACES } from "src/constants/game";
import diceRollSound from "src/sound_effect/dice_roll.mp3";
import loseSound from "src/sound_effect/lose_sound.mp3";
import useAudio from "src/hooks/useAudio";

const SHUFFLE_TICKS = 30;
const TICK_MS = 100;

export function Dice({
  setIsRolling,
  isRolling,
  setChangeBackground,
  locked = false,
}) {
  const { preloadSrcList } = useGreedyPigContext();
  const { setDiceValue } = useLiveGameContext();
  const { roll, isBusy, phase, message, lastRoll } = useGameSession();
  const [currentDice, setCurrentDice] = useState(0);
  const die = preloadSrcList.filter((dice) => dice.includes("dice"));
  const diceRollAudio = useAudio(diceRollSound);
  const loseAudio = useAudio(loseSound);

  const timer = useRef(null);
  // Stops a fast second click from sending a second roll
  const rollInFlight = useRef(false);

  useEffect(() => () => clearInterval(timer.current), []);

  const finishRoll = async (request) => {
    const res = await request;
    rollInFlight.current = false;
    setIsRolling(false);
    setChangeBackground(false);
    // null = not allowed or the request failed (the error banner explains why)
    if (!res) return;

    // The server picked the number. Math.random() is only used for the shuffle.
    const face = Array.isArray(res.dice) ? res.dice[0] : res.dice;
    setCurrentDice(face - 1);
    setDiceValue(face);
    if (res.bust) loseAudio?.play();
  };

    const handleDiceClick = () => {
      if (rollInFlight.current || isRolling || isBusy || locked) return;
      if (phase !== PHASE.PLAYING) return;

      rollInFlight.current = true;
      setIsRolling(true);
      setChangeBackground(true);

      let ticks = 0;
      timer.current = setInterval(() => {
        if (ticks < SHUFFLE_TICKS) {
          diceRollAudio?.play();
          setCurrentDice(Math.floor(Math.random() * DIE_FACES));
          ticks++;
        } else {
          clearInterval(timer.current);
          // Ask the server only once the shuffle is over, so the die and the
          // score both appear after the rolling stops.
          finishRoll(roll());
        }
      }, TICK_MS);
    };

  const isDisabled = isRolling || isBusy || locked || phase !== PHASE.PLAYING;
  // Fade only when the die can't be used for a reason other than "rolling now"
  const isFaded = !isRolling && isDisabled;
  const isBust = Boolean(lastRoll?.bust);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`hover:scale-105 active:scale-100 disabled:hover:scale-100 duration-300 md:w-auto w-[200px] ${
          isFaded ? "opacity-50" : ""
        }`}
        onClick={handleDiceClick}
        disabled={isDisabled}
      >
        {die.map((dice, index) => (
          <img
            key={index}
            src={dice}
            alt={currentDice + 1}
            className={`${currentDice === index ? "" : "hidden"}`}
          />
        ))}
      </button>
      <p
        className={`sec-font text-center text-sm lg:text-base min-h-[2.5rem] ${
          isBust ? "text-[#E71D36]" : "text-[#F9F7E8]"
        }`}
      >
        {!isRolling && message ? message : ""}
      </p>
    </div>
  );
}