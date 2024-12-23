import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { ATK_MULTIPLIER, itemTypes } from "./constants";

export const getRandomTask = ({ monster }: { monster: Doc<"monsters"> }) => {
  const randomTask =
    monster.tasks[Math.floor(Math.random() * monster.tasks.length)];
  return randomTask;
};

export const getRandomAtkMultiplier = () => {
  return ATK_MULTIPLIER[Math.floor(Math.random() * ATK_MULTIPLIER.length)];
};

export const calculateFinalDmg = ({
  playerAtk,
  atkMultiplier,
  hasSpecialPotionEffect,
}: {
  playerAtk: number;
  atkMultiplier: number;
  hasSpecialPotionEffect: boolean;
}) => {
  const finalDmg = Math.floor(
    hasSpecialPotionEffect
      ? playerAtk * atkMultiplier * 2
      : playerAtk * atkMultiplier
  );
  return finalDmg;
};

export const calculateMonsterDmg = ({
  monster,
}: {
  monster: Doc<"monsters">;
}) => {
  // get random number between monster.min_dmg and monster.max_dmg
  const monsterDmg = Math.floor(
    Math.random() * (monster.max_dmg - monster.min_dmg + 1) + monster.min_dmg
  );
  return monsterDmg;
};

export async function updatePlayerFightStatus({
  updatePlayerFightStatusMutation,
  playerStats,
  monster,
  playerAtk,
  monsterId,
  monsterHp,
  playerHp,
  monsterAtk,
  finalDmg,
  hasSpecialPotionEffect,
}: {
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  playerStats: Doc<"player_stats">;
  monster: Doc<"monsters">;
  playerAtk: number;
  monsterId: number;
  monsterHp: number;
  playerHp: number;
  finalDmg: number;
  monsterAtk: number;
  hasSpecialPotionEffect: boolean;
}) {
  const newAtkMultipler = getRandomAtkMultiplier();
  const newRandomTask = getRandomTask({ monster });
  const newFinalDmg = calculateFinalDmg({
    playerAtk: playerStats.atk,
    atkMultiplier: newAtkMultipler,
    hasSpecialPotionEffect,
  });
  const newMonsterAtk = calculateMonsterDmg({ monster });

  // check if the player is dead

  if (playerHp - monsterAtk <= 0) {
    return { status: "player_dead" };
  }

  // check if monster is dead

  if (monsterHp - finalDmg <= 0) {
    return { status: "monster_dead" };
  }

  await updatePlayerFightStatusMutation({
    fightStatus: {
      status: "fighting",
      monsterHp: monsterHp - finalDmg,
      playerHp: playerHp - monsterAtk,
      monsterId: monsterId,
      atkMultiplier: newAtkMultipler,
      currentTask: newRandomTask,
      finalDmg: newFinalDmg,
      monsterAtk: newMonsterAtk,
      playerAtk: playerAtk,
    },
  });

  return { status: "fight_continues" };
}

export const calculateHealAmount = ({
  playerCurrentHp,
  playerMaxHp,
  itemType,
}: {
  playerCurrentHp: number;
  playerMaxHp: number;
  itemType: itemTypes;
}) => {
  let healAmount: number;
  if (itemType === "restore1") {
    const halfHealth = Math.floor(playerMaxHp / 2);
    if (playerCurrentHp + halfHealth >= playerMaxHp) {
      healAmount = playerMaxHp - playerCurrentHp;
      return healAmount;
    }
    healAmount = halfHealth;
    return healAmount;
  }

  if (itemType === "restore2") {
    healAmount = playerMaxHp - playerCurrentHp;
    return healAmount;
  }

  if (itemType === "special" || itemType === "reroll") {
    return null;
  }
};
