/* eslint-disable no-param-reassign */

import omit from 'lodash.omit';

import { FieldType } from '@airtable/blocks/models';
import {
  Person,
  PersonPreference,
  PersonRecord,
  PersonRecordValue
} from '../util/types';

/**
 * Returns the affinity for mapping of FieldType.MULTIPLE_SELECTS fields.
 *
 * If either the mentor or the mentee has multiple values, then we normalize
 * the affinity by the maximum number of values.
 *
 * @param menteeValue - Value of the mentee data point.
 * @param mentorValue - Value of the mentor data point.
 */
const computeAffinityByMultipleSelectField = (
  menteeValue: Omit<PersonRecordValue, 'fieldName'>,
  mentorValue: Omit<PersonRecordValue, 'fieldName'>
) => {
  const menteeValues: string[] = menteeValue.value.split(', ');
  const mentorValues: string[] = mentorValue.value.split(', ');

  const maxResponses: number = Math.max(
    menteeValues.length,
    mentorValues.length
  );

  const totalScore: number = menteeValues.reduce(
    (accumulator: number, currentValue: string) =>
      mentorValues.includes(currentValue) ? accumulator + 1 : accumulator,
    0
  );

  // To ensure we don't return a score that is greater than 1, we divide
  // by the max number of responses.
  return totalScore / (maxResponses || 1);
};

/**
 * Returns the affinity for 1 specific mapping.
 *
 * Precondition: menteeValue.fieldType === mentorValue.fieldType and must
 * be either FieldType.SINGLE_SELECT or FieldType.MULTIPLE_SELECTS.
 *
 * @param menteeValue - Value of the mentee data point.
 * @param mentorValue - Value of the mentor data point.
 */
const computeAffinityByField = (
  menteeValue: Omit<PersonRecordValue, 'fieldName'>,
  mentorValue: Omit<PersonRecordValue, 'fieldName'>
): number => {
  switch (menteeValue.fieldType) {
    case FieldType.MULTIPLE_SELECTS:
      return computeAffinityByMultipleSelectField(menteeValue, mentorValue);

    default:
      return menteeValue.value === mentorValue.value ? 1 : 0;
  }
};

/**
 * Returns true if the record has the preference field. Returns false,
 * otherwise.
 */
const hasPreferenceField = ({
  preference,
  ...record
}: Omit<PersonRecord, 'id'>): boolean => {
  if (!preference) return false;

  return Object.values(record).some(
    ({ fieldName }: PersonRecordValue) => fieldName === preference
  );
};

/**
 * Returns an affinity score between 0.1 and 1.0 based on the mentee and mentor
 * data.
 *
 * Precondition: menteeValue.fieldType === mentorValue.fieldType and must
 * be either FieldType.SINGLE_SELECT or FieldType.MULTIPLE_SELECTS for all
 * values with menteeRecord and mentorRecord.
 *
 * @param menteeRecord - Data of the mentee.
 * @param mentorRecord - Data of the mentor.
 */
export const computeAffinity = (
  { preference: menteePreference, ...menteeRecord }: Omit<PersonRecord, 'id'>,
  { preference: mentorPreference, ...mentorRecord }: Omit<PersonRecord, 'id'>
): [number, number] => {
  let menteeAffinity = 0;
  let mentorAffinity = 0;

  const menteeRecordEntries: [string, PersonRecordValue][] = Object.entries(
    menteeRecord
  ) as [string, PersonRecordValue][];

  // # of categories that we use to calculate the affinity.
  const numCategories: number = menteeRecordEntries.length;

  // Multiples the preferred field's affinity score.
  const PREFERENCE_MULTIPLIER = 3;

  const hasMenteePreferenceField: boolean = hasPreferenceField({
    preference: menteePreference,
    ...menteeRecord
  });

  const hasMentorPreferenceField: boolean = hasPreferenceField({
    preference: mentorPreference,
    ...mentorRecord
  });

  // If 1 category, 1...
  // If 2 categories, 0.5...
  // If 5 categories, 0.2...
  const defaultCategoryWeight: number = 1 / numCategories;

  /**
   * @todo Add documentation for this calculation b/c it's abstract right now.
   */
  const weightWithPreference: number =
    defaultCategoryWeight *
    (1 / (1 + defaultCategoryWeight * (PREFERENCE_MULTIPLIER - 1)));

  const menteeCategoryWeight: number = hasMenteePreferenceField
    ? weightWithPreference
    : defaultCategoryWeight;

  const mentorCategoryWeight: number = hasMentorPreferenceField
    ? weightWithPreference
    : defaultCategoryWeight;

  menteeRecordEntries.forEach(
    ([mappingId, { fieldName: menteeFieldName, ...menteeValue }]: [
      string,
      PersonRecordValue
    ]) => {
      const { fieldName: mentorFieldName, ...mentorValue }: PersonRecordValue =
        mentorRecord[mappingId] as PersonRecordValue;

      const affinityByField: number = computeAffinityByField(
        menteeValue,
        mentorValue
      );

      const menteeWeight: number =
        !!menteePreference && menteeFieldName === menteePreference
          ? menteeCategoryWeight * PREFERENCE_MULTIPLIER
          : menteeCategoryWeight;

      const mentorWeight: number =
        !!mentorPreference && mentorFieldName === mentorPreference
          ? mentorCategoryWeight * PREFERENCE_MULTIPLIER
          : mentorCategoryWeight;

      menteeAffinity += affinityByField * menteeWeight;
      mentorAffinity += affinityByField * mentorWeight;
    }
  );

  return [menteeAffinity, mentorAffinity];
};

/**
 * Returns the preference lists as a 2-tuple of Person arrays.
 *
 * @example
 * ```js
 * // Returns [
 * //   [
 * //     { id: 'a', preferences: ['c', 'd'] },
 * //     { id: 'b', preferences: ['d', 'c'] }
 * //   ],
 * //   [
 * //     { id: 'c', preferences: ['a', 'b'] },
 * //     { id: 'd', preferences: ['b', 'a'] }
 * //   ]
 * // ].
 * createPreferenceLists(
 *  [
 *    { id: 'a', '123': 'Male' },
 *    { id: 'b', '123': 'Female' }
 *  ],
 *  [
 *    { id: 'c', '123': 'Male' },
 *    { id: 'd', '123': 'Female' }
 *  ]
 * )
 * ```
 */
const createPreferenceLists = (
  menteeRecords: PersonRecord[],
  mentorRecords: PersonRecord[]
): [Person[], Person[]] => {
  // Initializes the mentees with empty arrays as preferences.
  const mentees: Person[] = menteeRecords.map((menteeRecord: PersonRecord) => ({
    expandedPreferences: [],
    id: menteeRecord.id,
    preferences: []
  }));

  // Initializes the mentees with empty arrays as preferences.
  const mentors: Person[] = mentorRecords.map((mentorRecord: PersonRecord) => ({
    expandedPreferences: [],
    id: mentorRecord.id,
    preferences: []
  }));

  mentees.forEach((mentee: Person, i: number) => {
    mentors.forEach((mentor: Person, j: number) => {
      const [menteeAffinity, mentorAffinity]: [number, number] =
        computeAffinity(
          omit(menteeRecords[i], 'id'),
          omit(mentorRecords[j], 'id')
        );

      mentee.expandedPreferences = [
        ...mentee.expandedPreferences,
        { matchId: mentor.id, score: menteeAffinity }
      ];

      mentor.expandedPreferences = [
        ...mentor.expandedPreferences,
        { matchId: mentee.id, score: mentorAffinity }
      ];
    });
  });

  mentees.forEach((mentee: Person) => {
    mentee.preferences = mentee.expandedPreferences
      .sort((a: PersonPreference, b: PersonPreference) => b.score - a.score)
      .map(({ matchId }: PersonPreference) => matchId);
  });

  mentors.forEach((mentor: Person) => {
    mentor.preferences = mentor.expandedPreferences
      .sort((a: PersonPreference, b: PersonPreference) => b.score - a.score)
      .map(({ matchId }: PersonPreference) => matchId);
  });

  return [mentees, mentors];
};

export default createPreferenceLists;
