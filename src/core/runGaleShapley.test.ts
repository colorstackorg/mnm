import cases from 'jest-in-case';

import { Person, TestObject } from '../utils/types';
import runGaleShapley from './runGaleShapley';

cases(
  'runGaleShapley()',
  ({ input, output }: TestObject<[Person[], Person[]], string[][]>) => {
    expect(runGaleShapley(input[0], input[1])).toStrictEqual(output);
  },
  {
    'Has more mentors than mentees.': {
      input: [
        [
          { id: 'a', preferences: ['1', '2', '3'] },
          { id: 'b', preferences: ['2', '1', '3'] },
          { id: 'c', preferences: ['3', '2', '1'] }
        ],
        [
          { id: '1', preferences: ['a', 'b', 'c'] },
          { id: '2', preferences: ['b', 'a', 'c'] },
          { id: '3', preferences: ['c', 'b', 'a'] },
          { id: '4', preferences: ['c', 'b', 'a'] }
        ]
      ],
      output: [
        ['a', '1'],
        ['b', '2'],
        ['c', '3']
      ]
    },

    'Has same # of mentees and mentors.': {
      input: [
        [
          { id: 'a', preferences: ['1', '2', '3'] },
          { id: 'b', preferences: ['2', '1', '3'] },
          { id: 'c', preferences: ['3', '2', '1'] }
        ],
        [
          { id: '1', preferences: ['a', 'b', 'c'] },
          { id: '2', preferences: ['b', 'a', 'c'] },
          { id: '3', preferences: ['c', 'b', 'a'] }
        ]
      ],
      output: [
        ['a', '1'],
        ['b', '2'],
        ['c', '3']
      ]
    },

    'Is no mentees nor mentors.': {
      input: [[], []],
      output: []
    },

    'Mentors have the same preference list, and mentees have the same preference list.':
      {
        input: [
          [
            {
              id: 'Jehron Petty',
              preferences: ['Jermaine Cole', 'Kendrick Lamar']
            },
            {
              id: 'Rami Abdou',
              preferences: ['Jermaine Cole', 'Kendrick Lamar']
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
        ],
        output: [
          ['Rami Abdou', 'Jermaine Cole'],
          ['Jehron Petty', 'Kendrick Lamar']
        ]
      },

    'Mentors have the same preference list, but mentees do not.': {
      input: [
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
      ],
      output: [
        ['Rami Abdou', 'Jermaine Cole'],
        ['Jehron Petty', 'Kendrick Lamar']
      ]
    },

    'Mentors have the same preference list, but mentees do not. The least preferred mentee proposes earliest.':
      {
        input: [
          [
            {
              id: 'Jehron Petty',
              preferences: ['Kendrick Lamar', 'Jermaine Cole']
            },
            {
              id: 'Rami Abdou',
              preferences: ['Jermaine Cole', 'Kendrick Lamar']
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
        ],
        output: [
          ['Jehron Petty', 'Kendrick Lamar'],
          ['Rami Abdou', 'Jermaine Cole']
        ]
      }
  }
);
