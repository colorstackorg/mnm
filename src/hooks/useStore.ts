import { GlobalConfig } from '@airtable/blocks/types';
import { useGlobalConfig } from '@airtable/blocks/ui';
import { FIELD } from '../utils/constants';
import { FieldMapping, Store } from '../utils/types';

/**
 * Returns the Store that is seralized from the global configuration within
 * the Airtable app.
 */
const useStore = (): Store => {
  const globalConfig: GlobalConfig = useGlobalConfig();

  const fieldMappingIds: string[] = globalConfig.get(
    FIELD.FIELD_MAPPING_IDS
  ) as string[];

  const fieldMappings: Record<string, FieldMapping> = globalConfig.get(
    FIELD.FIELD_MAPPINGS
  ) as Record<string, FieldMapping>;

  const menteesPreferenceFieldId: string = globalConfig.get(
    FIELD.MENTEES_PREFERENCE_FIELD_ID
  ) as string;

  const menteesTableId: string = globalConfig.get(
    FIELD.MENTEES_TABLE_ID
  ) as string;

  const menteesTableLinkedFieldId: string = globalConfig.get(
    FIELD.MENTEES_TABLE_LINKED_FIELD_ID
  ) as string;

  const mentorsTableId: string = globalConfig.get(
    FIELD.MENTORS_TABLE_ID
  ) as string;

  return {
    fieldMappingIds,
    fieldMappings,
    menteesPreferenceFieldId,
    menteesTableId,
    menteesTableLinkedFieldId,
    mentorsTableId
  };
};

export default useStore;
