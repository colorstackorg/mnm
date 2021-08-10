import React from 'react';

import { Button } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useUpdateMenteeRecords from '../hooks/useUpdateMenteeRecords';
import { FIELD } from '../utils/constants';
import { FieldMapping, Store } from '../utils/types';

const FinishButton: React.FC = () => {
  const { fieldMappingIds, fieldMappings }: Store = useStore();
  const updateMenteeRecords: () => Promise<void> = useUpdateMenteeRecords();

  // The finish button is deemed to be "ready" if all of the mapping IDs have
  // been selected.
  const isReady: boolean = fieldMappingIds.every((mappingId: string) => {
    // The global state stores the mapping IDs directly by their IDs.
    const mappingField: FieldMapping = fieldMappings[mappingId];

    return (
      mappingField &&
      !!mappingField[FIELD.MENTEES_FIELD_ID] &&
      !!mappingField[FIELD.MENTORS_FIELD_ID]
    );
  });

  return (
    <Button
      disabled={!isReady}
      onClick={updateMenteeRecords}
      icon="check"
      variant="primary"
    >
      Finish
    </Button>
  );
};

export default FinishButton;
