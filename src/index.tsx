import React from 'react';

import { Session } from '@airtable/blocks/models';
import {
  Box,
  colors,
  initializeBlock,
  Text,
  useSession
} from '@airtable/blocks/ui';
import FinishButton from './components/FinishButton';
import MappingFieldList from './components/MappingFieldList';
import MenteesPreferenceField from './components/MenteesPreferenceField';
import MenteesTableField from './components/MenteesTableField';
import MenteesTableLinkedField from './components/MenteesTableLinkedField';
import MentorsTableField from './components/MentorsTableField';
import useInitStore from './hooks/useInitStore';

const AppPermissionErrorMessage: React.FC = () => {
  const session: Session = useSession();

  const hasPermissionToUpdateBase: boolean =
    session.hasPermissionToUpdateRecords();

  // Don't show error message if the user has permission to edit the base.
  if (hasPermissionToUpdateBase) return null;

  return (
    <Text style={{ color: colors.RED, marginTop: 16 }}>
      You do not have permissions to update records in this base, and thus
      cannot use this application.
    </Text>
  );
};

const App: React.FC = () => {
  const isInitialized: boolean = useInitStore();

  // Don't show the app unless the state was initialized properly.
  if (!isInitialized) return null;

  return (
    <Box style={{ padding: 16 }}>
      <MenteesTableField />
      <MentorsTableField />
      <MenteesTableLinkedField />
      <MenteesPreferenceField />
      <MappingFieldList />
      <FinishButton />
      <AppPermissionErrorMessage />
    </Box>
  );
};

initializeBlock(() => <App />);
