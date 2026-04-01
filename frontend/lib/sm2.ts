// SM-2 Algorithm for Spaced Repetition

export interface SM2Data {
  repetitions: number;
  easiness: number;
  interval: number;
  nextReviewDate: string; // ISO string
}

export const INITIAL_SM2: SM2Data = {
  repetitions: 0,
  easiness: 2.5,
  interval: 0,
  nextReviewDate: new Date().toISOString(),
};

/**
 * SuperMemo-2 Spaced Repetition Algorithm
 * @param quality 0-5 user rating (0=blackout, 5=perfect)
 * @param data Previous SM2 data for this item
 */
export function calculateSM2(quality: number, data: SM2Data): SM2Data {
  let { repetitions, easiness, interval } = data;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
    repetitions += 1;
  } else {
    // Incorrect response
    repetitions = 0;
    interval = 1;
  }

  easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    repetitions,
    easiness,
    interval,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

// Grades for the UI
export const SM2_GRADES = [
  { val: 0, label: "0", sub: "Blackout", color: "#FF6B6B" },
  { val: 1, label: "1", sub: "Wrong",    color: "#FF8E8E" },
  { val: 2, label: "2", sub: "Hard",     color: "#FFB347" },
  { val: 3, label: "3", sub: "Okay",     color: "#43C6AC" },
  { val: 4, label: "4", sub: "Easy",     color: "#5CE0C4" },
  { val: 5, label: "5", sub: "Perfect",  color: "#6C63FF" },
];
