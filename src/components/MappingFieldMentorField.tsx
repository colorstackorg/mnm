import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FieldPickerSynced } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { allowedTypes, FIELD } from '../utils/constants';
import { IdProps, Store } from '../utils/types';

const MappingFieldMentorField: React.FC<IdProps> = ({ id }: IdProps) => {
  const { mentorsTableId }: Store = useStore();
  const mentorsTable: Table = useTable(mentorsTableId);

  return (
    <FieldPickerSynced
      allowedTypes={allowedTypes}
      globalConfigKey={[FIELD.FIELD_MAPPINGS, id, FIELD.MENTORS_FIELD_ID]}
      placeholder={`Pick a field from ${mentorsTable.name}...`}
      table={mentorsTable}
    />
  );
};

export default MappingFieldMentorField;
