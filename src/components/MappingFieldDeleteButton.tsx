import React from 'react';

import { GlobalConfig } from '@airtable/blocks/types';
import { colors, TextButton, useGlobalConfig } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import { FIELD } from '../util/constants';
import { IdProps, Store } from '../util/types';

const MappingFieldDeleteButton: React.FC<IdProps> = ({ id }: IdProps) => {
  const globalConfig: GlobalConfig = useGlobalConfig();
  const { fieldMappingIds }: Store = useStore();

  // Shouldn't be able to delete the mapping if there is only 1.
  if (fieldMappingIds.length <= 1) return null;

  const onClick = (): void => {
    globalConfig.setPathsAsync([
      {
        path: [FIELD.FIELD_MAPPING_IDS],
        // Remove the mapping ID from the array of existing mapping IDs.
        value: fieldMappingIds.filter((mappingId: string) => mappingId !== id)
      },
      {
        path: [FIELD.FIELD_MAPPINGS, id],
        // Setting the value to undefined is the equivalent of removing the
        // path from the global config.
        value: undefined
      }
    ]);
  };

  return (
    <TextButton
      style={{ color: colors.RED, marginLeft: 16 }}
      icon="trash"
      size="large"
      onClick={onClick}
    />
  );
};

export default MappingFieldDeleteButton;
