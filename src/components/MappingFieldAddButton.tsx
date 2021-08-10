import { nanoid } from 'nanoid';
import React from 'react';

import { GlobalConfig } from '@airtable/blocks/types';
import { TextButton, useGlobalConfig } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const MappingFieldAddButton: React.FC = () => {
  const globalConfig: GlobalConfig = useGlobalConfig();
  const { fieldMappingIds }: Store = useStore();

  const onClick = (): void => {
    // Adds a new mapping ID to the existing array of mapping IDs.
    globalConfig.setAsync(FIELD.FIELD_MAPPING_IDS, [
      ...fieldMappingIds,
      nanoid()
    ]);
  };

  return (
    <TextButton onClick={onClick} padding="8px 12px" width="fit-content">
      + Add Mapping
    </TextButton>
  );
};

export default MappingFieldAddButton;
