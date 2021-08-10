import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FieldPickerSynced } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { allowedTypes, FIELD } from '../util/constants';
import { IdProps, Store } from '../util/types';

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
