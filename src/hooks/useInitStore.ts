import { nanoid } from 'nanoid';
import { useEffect } from 'react';

import { Session } from '@airtable/blocks/models';
import { GlobalConfig } from '@airtable/blocks/types';
import { useGlobalConfig, useSession } from '@airtable/blocks/ui';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';
import useStore from './useStore';

/**
 * Returns true if the store was initialized properly. The state is
 * "initialized" if FIELD.FIELD_MAPPING_IDS is non-null.
 *
 * @param globalConfig - Configuration to read store from.
 */
const isStoreInitialized = ({
  fieldMappingIds
}: Pick<Store, 'fieldMappingIds'>): boolean => !!fieldMappingIds?.length;

/**
 * Returns true if the store is initialized OR if the user doesn't have
 * permissions to initialzize the store. Returns false, otherwise.
 */
const useInitStore = (): boolean => {
  const session: Session = useSession();
  const { fieldMappingIds }: Store = useStore();
  const globalConfig: GlobalConfig = useGlobalConfig();

  const hasPermissions: boolean = session.hasPermissionToUpdateRecords();

  useEffect(() => {
    // No need to initialize if:
    // - user doesn't have the permissions to update the globalConfig.
    // - there are already fieldMappingIds.
    if (!hasPermissions || fieldMappingIds) return;

    // Initializes the FIELD_MAPPINGS if it hasn't been set yet.
    const initialMappingId: string = nanoid();

    globalConfig.setPathsAsync([
      { path: [FIELD.FIELD_MAPPING_IDS], value: [initialMappingId] },
      { path: [FIELD.FIELD_MAPPINGS, initialMappingId], value: {} }
    ]);
  }, [fieldMappingIds, globalConfig, hasPermissions, session]);

  return !hasPermissions || isStoreInitialized({ fieldMappingIds });
};

export default useInitStore;
