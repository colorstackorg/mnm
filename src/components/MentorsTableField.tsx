import React from 'react';

import { Table } from '@airtable/blocks/models';
import {
  colors,
  FormField,
  TablePickerSynced,
  Text
} from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import useStore from '../hooks/useStore';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const MentorsTableFieldPermissionErrorMessage: React.FC = () => {
  const [, mentorsTable]: [Table, Table] = useSelectedTables();

  const hasPermissionToUpdate: boolean =
    mentorsTable?.hasPermissionToUpdateRecords();

  // Don't show error if:
  // - user hasn't selected a mentors table yet.
  // - user has permission to update the selected mentors table.
  if (!mentorsTable || hasPermissionToUpdate) return null;

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      You do not have permission to update this table.
    </Text>
  );
};

const MentorsTableFieldErrorMessage: React.FC = () => {
  const { menteesTableId, mentorsTableId }: Store = useStore();

  // Don't show if:
  // - no mentees table has been selected yet.
  // - the mentees table is different than the mentors table.
  if (!menteesTableId || menteesTableId !== mentorsTableId) return null;

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      The mentees table must be different than the mentors table.
    </Text>
  );
};

const MentorsTableField: React.FC = () => (
  <FormField
    description="Pick the table that stores the mentor records."
    label="Mentors Table"
  >
    <TablePickerSynced globalConfigKey={FIELD.MENTORS_TABLE_ID} />

    {<MentorsTableFieldErrorMessage /> ?? (
      <MentorsTableFieldPermissionErrorMessage />
    )}
  </FormField>
);

export default MentorsTableField;
