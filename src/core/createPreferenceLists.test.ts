import cases from 'jest-in-case';

import { FieldType } from '@airtable/blocks/models';
import { Person, PersonRecord, TestObject } from '../util/types';
import createPreferenceLists, {
  computeAffinity
} from './createPreferenceLists';

cases(
  'computeAffinity()',
  ({
    input,
    output
  }: TestObject<
    [Omit<PersonRecord, 'id'>, Omit<PersonRecord, 'id'>],
    [number, number]
  >) => {
    expect(computeAffinity(input[0], input[1])).toStrictEqual(output);
  },
  {
    'Should return affinity of 0.': {
      input: [
        {
          abc: {
            fieldType: FieldType.SINGLE_SELECT,
            value: 'Information Science'
          }
        },
        {
          abc: { fieldType: FieldType.SINGLE_SELECT, value: 'Computer Science' }
        }
      ],
      output: [0, 0]
    },

    'Should return affinity of 3.': {
      input: [
        {
          abc: {
            fieldType: FieldType.MULTIPLE_SELECTS,
            value: 'Information Science, Computer Science'
          },
          def: { fieldType: FieldType.SINGLE_SELECT, value: null },
          ghi: {
            fieldType: FieldType.SINGLE_SELECT,
            value: 'Software Engineer'
          }
        },
        {
          abc: {
            fieldType: FieldType.MULTIPLE_SELECTS,
            value: 'Information Science, Computer Science'
          },
          def: {
            fieldType: FieldType.SINGLE_SELECT,
            value: 'Cornell University'
          },
          ghi: {
            fieldType: FieldType.SINGLE_SELECT,
            value: 'Software Engineer'
          }
        }
      ],
      output: [3, 3]
    }
  }
);

cases(
  'createPreferenceLists()',
  ({
    input,
    output
  }: TestObject<[PersonRecord[], PersonRecord[]], [Person[], Person[]]>) => {
    const [mentees, mentors]: [Person[], Person[]] = createPreferenceLists(
      input[0],
      input[1]
    );

    mentees.forEach((mentee: Person, i: number) => {
      expect(mentee.preferences).toStrictEqual(output[0][i]?.preferences);
    });

    mentors.forEach((mentor: Person, i: number) => {
      expect(mentor.preferences).toStrictEqual(output[1][i]?.preferences);
    });
  },
  {
    'Case #2': {
      input: [
        [
          {
            id: 'Rami Abdou',
            major: {
              fieldType: FieldType.SINGLE_SELECT,
              value: 'Computer Science'
            },
            race: {
              fieldType: FieldType.MULTIPLE_SELECTS,
              value: 'Black/African-American, Hispanic/Latinx'
            }
          },
          {
            id: 'Jehron Petty',
            major: {
              fieldType: FieldType.SINGLE_SELECT,
              value: 'Information Science'
            },
            race: {
              fieldType: FieldType.MULTIPLE_SELECTS,
              value: 'Hispanic/Latinx'
            }
          }
        ],
        [
          {
            id: 'Jermaine Cole',
            major: {
              fieldType: FieldType.SINGLE_SELECT,
              value: 'Computer Science'
            },
            race: {
              fieldType: FieldType.MULTIPLE_SELECTS,
              value: 'Black/African-American'
            }
          },
          {
            id: 'Kendrick Lamar',
            major: {
              fieldType: FieldType.SINGLE_SELECT,
              value: 'Computer Science'
            },
            race: {
              fieldType: FieldType.MULTIPLE_SELECTS,
              value: 'Hispanic/Latinx'
            }
          }
        ]
      ],
      output: [
        [
          {
            id: 'Rami Abdou',
            preferences: ['Jermaine Cole', 'Kendrick Lamar']
          },
          {
            id: 'Jehron Petty',
            preferences: ['Kendrick Lamar', 'Jermaine Cole']
          }
        ],
        [
          {
            id: 'Jermaine Cole',
            preferences: ['Rami Abdou', 'Jehron Petty']
          },
          {
            id: 'Kendrick Lamar',
            preferences: ['Rami Abdou', 'Jehron Petty']
          }
        ]
      ]
    },

    'Is empty array.': { input: [[], []], output: [[], []] }
  }
);
