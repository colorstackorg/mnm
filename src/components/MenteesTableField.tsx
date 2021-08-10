import React from 'react';

import { Table } from '@airtable/blocks/models';
import {
  colors,
  FormField,
  TablePickerSynced,
  Text
} from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import { FIELD } from '../utils/constants';

const MenteesTableFieldErrorMessage: React.FC = () => {
  const [menteesTable]: [Table, Table] = useSelectedTables();

  const hasPermissionToUpdate: boolean =
    menteesTable?.hasPermissionToUpdateRecords();

  // Don't show error if:
  // - user hasn't selected a mentees table yet.
  // - user has permission to update the selected mentees table.
  if (!menteesTable || hasPermissionToUpdate) return null;

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      You do not have permission to update this table.
    </Text>
  );
};

const MenteesTableField: React.FC = () => (
  <FormField
    description="Pick the table that stores the mentee records."
    label="Mentees Table"
  >
    <TablePickerSynced globalConfigKey={FIELD.MENTEES_TABLE_ID} />
    <MenteesTableFieldErrorMessage />
  </FormField>
);

export default MenteesTableField;
