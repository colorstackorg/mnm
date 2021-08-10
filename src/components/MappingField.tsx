import React from 'react';

import { Field, FieldType, Table } from '@airtable/blocks/models';
import { Box, colors, Text } from '@airtable/blocks/ui';
import useSelectedTables from '../hooks/useSelectedTables';
import useStore from '../hooks/useStore';
import { IdProps, Store } from '../util/types';
import MappingFieldDeleteButton from './MappingFieldDeleteButton';
import MappingFieldMenteeField from './MappingFieldMenteeField';
import MappingFieldMentorField from './MappingFieldMentorField';

const MappingFieldErrorMessage: React.FC<IdProps> = ({ id }: IdProps) => {
  const { fieldMappings }: Store = useStore();
  const [menteesTable, mentorsTable]: [Table, Table] = useSelectedTables();

  const menteesFieldId: string = fieldMappings[id]?.menteesFieldId;
  const mentorsFieldId: string = fieldMappings[id]?.mentorsFieldId;

  const menteesField: Field = menteesTable.getFieldByIdIfExists(menteesFieldId);
  const mentorsField: Field = mentorsTable.getFieldByIdIfExists(mentorsFieldId);

  const menteesFieldType: FieldType = menteesField?.type;
  const mentorsFieldType: FieldType = mentorsField?.type;

  // Don't show error if:
  // - both fields haven't been selected.
  // - OR, the field types are the same.
  if (
    !menteesFieldId ||
    !mentorsFieldId ||
    menteesFieldType === mentorsFieldType
  ) {
    return null;
  }

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      The field types must match. You selected {menteesFieldType} and a{' '}
      {mentorsFieldType}.
    </Text>
  );
};

const MappingField: React.FC<IdProps> = ({ id }: IdProps) => (
  <>
    <Box
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8
      }}
    >
      <MappingFieldMenteeField id={id} />
      <Text style={{ marginLeft: 8, marginRight: 8 }}>to</Text>
      <MappingFieldMentorField id={id} />
      <MappingFieldDeleteButton id={id} />
    </Box>

    <MappingFieldErrorMessage id={id} />
  </>
);

export default MappingField;
