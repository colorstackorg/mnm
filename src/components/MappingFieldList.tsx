import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FormField } from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import useStore from '../hooks/useStore';
import { Store } from '../utils/types';
import { areTablesValid, isLinkedFieldValid } from '../utils/util';
import MappingField from './MappingField';
import MappingFieldAddButton from './MappingFieldAddButton';

const MappingFieldList: React.FC = () => {
  const { fieldMappingIds, menteesTableLinkedFieldId }: Store = useStore();
  const [menteesTable, mentorsTable]: [Table, Table] = useSelectedTables();

  // Don't show if:
  // - the selected tables aren't valid.
  // - the linked field is not valid.
  if (
    !areTablesValid([menteesTable, mentorsTable]) ||
    !isLinkedFieldValid([menteesTable, mentorsTable], menteesTableLinkedFieldId)
  ) {
    return null;
  }

  return (
    <FormField
      label="Map Mentee to Mentor Fields"
      description="What fields do you want the mentees and mentors to be matched on? Please map each mentee field to the corresponding mentor field."
    >
      <ul style={{ padding: 0 }}>
        {fieldMappingIds.map((fieldMappingId: string) => (
          <MappingField id={fieldMappingId} key={fieldMappingId} />
        ))}
      </ul>

      <MappingFieldAddButton />
    </FormField>
  );
};

export default MappingFieldList;
