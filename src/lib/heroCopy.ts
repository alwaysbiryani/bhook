/** Time-of-day (and lightly weather/season-aware) hero lines, in Hinglish a real
 *  person would say. Deterministic per hour so it's stable within a visit. */

type Line = { kicker: string };

const BY_HOUR: Record<string, string[]> = {
  lateNight: [
    "3am. Biryani ya Maggi?",
    "Neend nahi aa rahi? Kuch mangwa lete hain.",
    "So late it's basically breakfast. Order kuch?",
  ],
  earlyMorning: [
    "Subah subah — poha-jalebi?",
    "Chai pe charcha? Pehle chai.",
    "Uth gaye? Nashte ka socho.",
  ],
  breakfast: [
    "Nashta ho jaaye?",
    "Idli, dosa, ya seedha biryani?",
    "Empty stomach, full ambitions.",
  ],
  lunch: [
    "Lunch time. Thali ya biryani?",
    "Dopahar ho gayi. Kuch heavy?",
    "Skip the meeting, not the meal.",
  ],
  teaTime: [
    "Baarish hai. Pakode?",
    "Shaam ki chai ke saath kuch crispy?",
    "4 baj gaye. Samosa toh banta hai.",
  ],
  dinner: [
    "Dinner? Aaj kuch achha mangwate hain.",
    "Raat ka khana sorted karein?",
    "Bhookh lagi hai. Obviously.",
  ],
  night: [
    "Late-night craving? Same.",
    "Ek aur order, kyunki mood hai.",
    "Din bhar bacha ke rakha, ab kharch karo — ₹0.",
  ],
};

function bucket(hour: number): keyof typeof BY_HOUR {
  if (hour < 5) return "lateNight";
  if (hour < 8) return "earlyMorning";
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 18) return "teaTime";
  if (hour < 22) return "dinner";
  return "night";
}

export function heroLine(date = new Date()): Line {
  const list = BY_HOUR[bucket(date.getHours())];
  // rotate by day so the same hour isn't identical every visit
  const idx = (date.getHours() + date.getDate()) % list.length;
  return { kicker: list[idx] };
}

/** A safe default for server render / pre-hydration. */
export const DEFAULT_KICKER = "Bhookh lagi hai?";
