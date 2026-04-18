import { pick } from "./random";

const greetings: Record<string, string[]> = {
  lateNight: [
    "Bestie it's {hour}am. girl dinner is a lifestyle",
    "The fridge light is your only guiding star at {hour}am",
    "It's {hour}am and you're thriving. allegedly",
    "Shh. {hour}am snacking is between you and god",
  ],
  morning: [
    "Good morning. breakfast is also girl dinner",
    "Rise and dine, queen",
    "Eggs? toast? just vibes? all valid",
    "Morning bestie. calories don't count before noon",
  ],
  lunch: [
    "Lunch? in this economy?",
    "Noon has arrived and so has your hunger",
    "Midday snack or full meal? trick question. both",
    "Lunchtime is girl dinner's natural habitat",
  ],
  afternoon: [
    "The 3pm slump says: snack plate",
    "Afternoon cravings are a form of self-care",
    "It's snack o'clock somewhere",
    "The afternoon hunger is calling. will you answer?",
  ],
  evening: [
    "Golden hour. golden cheese cubes.",
    "Dinner time. or as we call it: the main event",
    "Evening vibes call for evening bites",
    "Sunset snacking: a fine art",
  ],
  night: [
    "Late night feral mode: activated",
    "The kitchen calls at this hour. answer it",
    "Nighttime nibbling is a love language",
    "It's giving midnight munchies",
  ],
};

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();

  let pool: string[];
  let displayHour: string;

  if (hour >= 0 && hour < 5) {
    pool = greetings.lateNight;
    displayHour = String(hour === 0 ? 12 : hour);
  } else if (hour >= 5 && hour < 11) {
    pool = greetings.morning;
    displayHour = String(hour);
  } else if (hour >= 11 && hour < 15) {
    pool = greetings.lunch;
    displayHour = String(hour);
  } else if (hour >= 15 && hour < 18) {
    pool = greetings.afternoon;
    displayHour = String(hour);
  } else if (hour >= 18 && hour < 22) {
    pool = greetings.evening;
    displayHour = String(hour);
  } else {
    pool = greetings.night;
    displayHour = String(hour);
  }

  return pick(pool).replace("{hour}", displayHour);
}
