import { Person } from '../utils/types';

/**
 * Returns true if the mentor prefers the newMenteeId to the
 * currentlyEngagedMenteeId. Checks the mentor preference list for this.
 *
 * @param mentor - Mentor to assess mentee rankings for.
 * @param currentlyEngagedMenteeId - ID of the mentee that mentor is currently
 * engaged to.
 * @param newMenteeId - ID of the mentee that is proposing.
 */
const doesMentorPreferNewMentee = (
  mentor: Person,
  currentlyEngagedMenteeId: string,
  newMenteeId: string
): boolean => {
  const previousEngagmentRanking: number = (
    mentor.preferences as string[]
  ).findIndex((menteeId: string) => menteeId === currentlyEngagedMenteeId);

  const newMenteeRanking: number = (mentor.preferences as string[]).findIndex(
    (menteeId: string) => menteeId === newMenteeId
  );

  // The lower the ranking the "higher" the preference, since the preferences
  // are sorted in descending order.
  return newMenteeRanking < previousEngagmentRanking;
};

/**
 * Returns an array of 2-tuples that represent [mentee ID, mentor ID].
 *
 * @example
 * // Returns [['a', '1'], ['b', '2'], ['c', '3']].
 * runGaleShapley({
 *  mentees: [
 *    { id: 'a', preferences: ['1', '2', '3'] },
 *    { id: 'b', preferences: ['2', '1', '3'] },
 *    { id: 'c', preferences: ['3', '2', '1'] },
 *  ],
 *  mentors: [
 *    { id: '1', preferences: ['a', 'b', 'c'] },
 *    { id: '2', preferences: ['b', 'a', 'c'] },
 *    { id: '3', preferences: ['c', 'b', 'a'] },
 *  ],
 * })
 */
const runGaleShapley = (
  mentees: Person[],
  mentors: Person[]
): [string, string][] => {
  // Engagements formatted like: { [mentorId]: mentee }
  const engagements: Record<string, Person> = {};

  // We can stop when all of the mentees are engaged to a mentor.
  while (mentees.length > 0) {
    const mentee: Person = mentees.shift();
    const preferredMentorId: string = mentee.preferences.shift();

    // If the mentor is currently matched, grab their engaged mentee/
    const currentlyEngagedMentee: Person | null =
      engagements[preferredMentorId];

    // If the mentor hasn't been matched with a mentee yet, propose!
    if (!currentlyEngagedMentee?.id) {
      engagements[preferredMentorId] = mentee;
      continue;
    }

    // Find the mentor in the mentors list by it's ID.
    // TODO: This is a lengthy operation...how can we optimize?
    const mentor: Person = mentors.find(
      (element: Person) => element.id === preferredMentorId
    );

    if (
      doesMentorPreferNewMentee(mentor, currentlyEngagedMentee.id, mentee.id)
    ) {
      // Ditch the old mentee and match with the new/better mentee.
      engagements[preferredMentorId] = mentee;

      // The old, ditched mentee lost their mentor, need to match them again,
      // so we put them first on the list to re-engage.
      mentees.unshift(currentlyEngagedMentee);

      continue;
    }

    // If the mentee couldn't match with the mentor, put them back on the stack
    // so we can run again with the next best mentor preference.
    mentees.unshift(mentee);
  }

  // Need to format the pairs in the form of [menteeId, mentorId].
  const formattedPairs: [string, string][] = Object.entries(engagements).map(
    ([mentorId, mentee]: [string, Person]) => [mentee.id, mentorId]
  );

  return formattedPairs;
};

export default runGaleShapley;
