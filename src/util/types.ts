import { FieldType } from '@airtable/blocks/models';

/**
 * Represents information about the Airtable field and response (cell value).
 */
export type PersonRecordValue = {
  /**
   * Name of the Airtable field that the value is for. This is needed b/c
   * for calculating affinity, we need to check the mentee's preference (which
   * is just the name of an Airtable field as well).
   */
  fieldName?: string;

  /**
   * Type of the Airtable field.
   */
  fieldType: FieldType;

  /**
   * Value of the Airtable cell. Array values are still represented as strings
   * with commas separating values.
   */
  value: string;
};

type PersonRecordBase = {
  /**
   * ID of the Airtable record.
   */
  id: string;

  /**
   * Name of the Airtable field within the table that the person wants to weigh
   * the most in the algorithm. Currently, this can be non-null for mentees,
   * but will always be null for mentors.
   */
  preference?: string;
};

/**
 * Formatted object w/ Airtable values for a mentee/mentor from a record.
 */
export type PersonRecord = PersonRecordBase &
  Record<string, string | PersonRecordValue>;

/**
 * Represents preference for a mentee/mentor with affinity score.
 */
export type PersonPreference = {
  /**
   * ID of the Airtable record that is matched with the current Person. Could
   * be a mentee ID or mentor ID.
   */
  matchId: string;

  /**
   * Affinity score between 2 Person(s). Represents value between 0 and 1.
   * @todo Currently, values are normalized between 0 and 1, yet.
   */
  score: number;
};

export type Person = {
  /**
   * List of preferences including the affinity scores.
   */
  expandedPreferences?: PersonPreference[];

  /**
   * ID of the Airtable record.
   */
  id: string;

  /**
   * List of preferences (just the ID of the respective mentees/mentors).
   */
  preferences?: string[];
};

// GLOBAL STATE

/**
 * Represents the 1-1 relationship for a mapping a field from the mentees table
 * to a field from the mentors table.
 */
export type FieldMapping = {
  /**
   * ID of the field on the mentees table.
   */
  menteesFieldId: string;

  /**
   * ID of the field on the mentors table.
   */
  mentorsFieldId: string;
};

/**
 * Global store of the application.
 */
export type Store = {
  /**
   * ID's representing each of the "mentee"-to-"mentor" field mappings.
   */
  fieldMappingIds: string[];

  /**
   * Maps a mapping ID to field mapping.
   */
  fieldMappings: Record<string, FieldMapping>;

  /**
   * Name of the preference field on the "mentees" table, if it exists.
   */
  menteesPreferenceFieldId: string;

  /**
   * ID of the "mentees" table.
   */
  menteesTableId: string;

  /**
   * ID of the linked field on the "mentees" table that links to "mentors"
   * table.
   */
  menteesTableLinkedFieldId: string;

  /**
   * ID of the Airtable "mentors" table.
   */
  mentorsTableId: string;
};

// MISCELLANEOUS TYPES

/**
 * Props for React component with an ID property.
 */
export type IdProps = {
  id: string;
};

/**
 * Utility used for writing test cases with jest-in-case.
 */
export type TestObject<T = unknown, S = unknown> = {
  /**
   * Input arguments/data for a test case.
   */
  input: T;

  /**
   * Expected output for a test case.
   */
  output: S;
};
