import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FieldPickerSynced } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { allowedTypes, FIELD } from '../util/constants';
import { IdProps, Store } from '../util/types';

const MappingFieldMenteeField: React.FC<IdProps> = ({ id }: IdProps) => {
  const { menteesTableId }: Store = useStore();
  const menteesTable: Table = useTable(menteesTableId);

  return (
    <FieldPickerSynced
      allowedTypes={allowedTypes}
      globalConfigKey={[FIELD.FIELD_MAPPINGS, id, FIELD.MENTEES_FIELD_ID]}
      placeholder={`Pick a field from ${menteesTable.name}...`}
      table={menteesTable}
    />
  );
};

export default MappingFieldMenteeField;
