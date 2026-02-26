import { useMemo } from 'react';
import { ResourceType } from '~DevelopmentPlan/const/types';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

interface GetPersonalDevelopmentModalTabsParams {
  featureNamesText: FeatureNamesText,
}

export type TabItem = {
  value: number;
  label: string;
};

export type ModalTabs = Record<string, Record<string, TabItem>>;

const getPersonalDevelopmentModalTabs = ({ featureNamesText }: GetPersonalDevelopmentModalTabsParams): ModalTabs => ({
  [ResourceType.All]: {
    New: {
      value: 0,
      label: 'Not Found',
    },
    Existing: {
      value: 1,
      label: 'Not Found',
    },
  },
  [ResourceType.Goal]: {
    New: {
      value: 0,
      label: `New ${featureNamesText.goals.singular}`,
    },
    Existing: {
      value: 1,
      label: `Existing ${featureNamesText.goals.singular}`,
    },
  },
  [ResourceType.Learning]: {
    New: {
      value: 0,
      label: 'New Learning',
    },
    Existing: {
      value: 1,
      label: 'Existing Learning',
    },
  },
  [ResourceType.Feedback]: {
    New: {
      value: 0,
      label: 'New Feedback',
    },
    Existing: {
      value: 1,
      label: 'Existing Feedback',
    },
  },
  [ResourceType.ActionItem]: {
    New: {
      value: 0,
      label: 'New Action Item',
    },
    Existing: {
      value: 1,
      label: 'Existing Action Item',
    },
  },
  [ResourceType.Recognition]: {
    New: {
      value: 0,
      label: 'New Recognition',
    },
    Existing: {
      value: 1,
      label: 'Existing Recognition',
    },
  },
  [ResourceType.Accomplishment]: {
    New: {
      value: 0,
      label: 'New Accomplishment',
    },
    Existing: {
      value: 1,
      label: 'Existing Accomplishment',
    },
  },
  [ResourceType.Meeting]: {
    New: {
      value: 0,
      label: 'New Meeting',
    },
    Existing: {
      value: 1,
      label: 'Existing Meeting',
    },
  },
  [ResourceType.LearningPlaylist]: {
    New: {
      value: 0,
      label: 'New Learning Playlist',
    },
    Existing: {
      value: 1,
      label: 'Existing Learning Playlist',
    },
  },
});

interface PersonalDevelopmentModalTabs {
  modalTabs: ModalTabs,
}

const useGetPersonalDevelopmentModalTabs = (): PersonalDevelopmentModalTabs => {
  const { featureNamesText } = useGetFeatureNamesText();

  const modalTabs = useMemo(() => getPersonalDevelopmentModalTabs({ featureNamesText }), [featureNamesText]);

  return {
    modalTabs,
  };
};

export default useGetPersonalDevelopmentModalTabs;
