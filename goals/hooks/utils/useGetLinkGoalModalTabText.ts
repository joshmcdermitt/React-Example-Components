import { useMemo } from 'react';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

export enum LinkGoalModalTab {
  Existing = 'Existing',
  New = 'New',
}

interface TabTextMapParams {
  featureNamesText: FeatureNamesText,
}

interface GetLinkGoalModalTabTextReturn {
  [LinkGoalModalTab.Existing]: string,
  [LinkGoalModalTab.New]: string,
}

const getLinkGoalModalTabText = ({ featureNamesText }: TabTextMapParams): GetLinkGoalModalTabTextReturn => ({
  [LinkGoalModalTab.Existing]: `Existing ${featureNamesText.goals.plural}`,
  [LinkGoalModalTab.New]: `New ${featureNamesText.goals.singular}`,
});

export interface LinkGoalModalTabText {
  tabText: GetLinkGoalModalTabTextReturn,
}

const useGetLinkGoalModalTabText = (): LinkGoalModalTabText => {
  const { featureNamesText } = useGetFeatureNamesText();

  const tabText = useMemo(() => getLinkGoalModalTabText({ featureNamesText }), [featureNamesText]);

  return {
    tabText,
  };
};

export default useGetLinkGoalModalTabText;
