import React from 'react';

import { FieldType, Table } from '@airtable/blocks/models';
import {
  colors,
  FieldPickerSynced,
  FormField,
  Text
} from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import useStore from '../hooks/useStore';
import { FIELD } from '../utils/constants';
import { areTablesValid, isLinkedFieldValid } from '../utils/util';

const MenteesTableLinkedFieldErrorMessage: React.FC = () => {
  const { menteesTableLinkedFieldId } = useStore();
  const [menteesTable, mentorsTable]: [Table, Table] = useSelectedTables();

  // Don't show error if:
  // - user hasn't tried linking the tables yet.
  // - the linked field is valid.
  if (
    !menteesTableLinkedFieldId ||
    isLinkedFieldValid([menteesTable, mentorsTable], menteesTableLinkedFieldId)
  ) {
    return null;
  }

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      Must select a field that links to the {mentorsTable.name} table.
    </Text>
  );
};

const MenteesTableLinkedField: React.FC = () => {
  const [menteesTable, mentorsTable]: [Table, Table] = useSelectedTables();

  // Don't show if the selected tables aren't valid.
  if (!areTablesValid([menteesTable, mentorsTable])) return null;

  return (
    <FormField
      description="Pick the field on the mentees table that links to the mentors table."
      label="Link Mentees to Mentors"
    >
      <FieldPickerSynced
        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
        globalConfigKey={FIELD.MENTEES_TABLE_LINKED_FIELD_ID}
        placeholder={`Pick a field from ${menteesTable.name}...`}
        table={menteesTable}
      />

      <MenteesTableLinkedFieldErrorMessage />
    </FormField>
  );
};

export default MenteesTableLinkedField;
