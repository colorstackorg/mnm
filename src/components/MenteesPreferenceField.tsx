import React from 'react';

import { FieldType, Table } from '@airtable/blocks/models';
import { FieldPickerSynced, FormField } from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import useStore from '../hooks/useStore';
import { FIELD } from '../utils/constants';
import { Store } from '../utils/types';
import { areTablesValid, isLinkedFieldValid } from '../utils/util';

const MenteesPreferenceField: React.FC = () => {
  const { menteesTableLinkedFieldId }: Store = useStore();
  const [menteesTable, mentorsTable]: [Table, Table] = useSelectedTables();

  // Don't show if:
  // - the selected tables aren't valid.
  // - the linked field is not valid.
  if (
    !areTablesValid([menteesTable, mentorsTable]) ||
    !isLinkedFieldValid([menteesTable, mentorsTable], menteesTableLinkedFieldId)
  )
    return null;

  return (
    <FormField
      description="If mentees are given the ability to choose a preference, please select the field that stores the preference. Note: All options for preference must be the name of a field in the mentees table."
      label="Mentees Preference"
    >
      <FieldPickerSynced
        allowedTypes={[FieldType.SINGLE_SELECT]}
        globalConfigKey={FIELD.MENTEES_PREFERENCE_FIELD_ID}
        placeholder={`Pick a field from ${menteesTable?.name}...`}
        table={menteesTable}
      />
    </FormField>
  );
};

export default MenteesPreferenceField;
