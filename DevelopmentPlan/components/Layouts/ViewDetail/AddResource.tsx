import { css } from '@emotion/react';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { palette } from '~Common/styles/colors';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { Popover } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { DropdownItem } from '~Common/V3/components/Dropdown';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { personalDevelopmentShareLearningDrawer } from '~DevelopmentPlan/components/Drawers/Learning/ShareLearningDrawer';
import Tooltip from '~Common/components/Tooltip';
import { useParams } from 'react-router-dom';
import { createIncompleteFeedbackTemplate } from '~Feedback/components/Drawers/Request/Create';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import { GenerateCompetencyFilterData } from '~DevelopmentPlan/const/functions';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import useGetPersonalDevelopmentResourceTypeOptions from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeOptions';
import { PersonalDevelopmentPlanDetailsParams } from './PersonalDevelopmentPlanDetails';

const styles = {
  resourceList: css({
    padding: '.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }),
  resourceItem: css({
    all: 'unset',
    color: palette.neutrals.gray900,
    fontSize: '.875rem',
    fontWeight: 500,

    ':hover': {
      color: palette.brand.indigo,
    },
  }),
};

interface ViewProps {
  showResourceOptions: (event: MouseEvent<HTMLButtonElement>) => void,
  handleClose: () => void,
  id: string | undefined,
  open: boolean,
  anchorEl: HTMLButtonElement | null,
  items: DropdownItem<ResourceType[]>[],
  addResource: (resourceId: number, competencyId: number) => void,
  competencyId: number,
  isOptimisticallyUpdated: boolean,
}

const View = ({
  showResourceOptions,
  handleClose,
  id,
  open,
  anchorEl,
  items,
  addResource,
  competencyId,
  isOptimisticallyUpdated,
}: ViewProps): JSX.Element => (
  <>
    {isOptimisticallyUpdated && (
      <Tooltip content="This competency is saving. Once it is fully saved, you'll be able to add your resources.">
        <div>
          <JoshButton
            data-test-id="personalDevelopmentAddResource"
            size="small"
            onClick={showResourceOptions}
            disabled
          >
            <JoshButton.IconAndText
              icon={faCaretDown}
              text="Add"
              flipIconOrder
            />
          </JoshButton>
        </div>
      </Tooltip>
    )}
    {!isOptimisticallyUpdated && (
    <JoshButton
      data-test-id="personalDevelopmentAddResource"
      size="small"
      onClick={showResourceOptions}
    >
      <JoshButton.IconAndText
        icon={faCaretDown}
        text="Add"
        flipIconOrder
      />
    </JoshButton>
    )}
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div
        css={styles.resourceList}
      >
        {items && items.map((item) => (
          <button
            key={item.value}
            onClick={() => addResource(item.value, competencyId)}
            css={styles.resourceItem}
          >
            {item.text}
          </button>
        ))}
      </div>
    </Popover>
  </>
);

interface AddResourceProps {
  competencyId?: number,
  isOptimisticallyUpdated?: boolean,
}

export const AddResource = ({
  competencyId = OPTIMISTIC_ID,
  isOptimisticallyUpdated = false,
}: AddResourceProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'addResourcePopover' : undefined;

  const showResourceOptions = (event: MouseEvent<HTMLButtonElement>):void => {
    setAnchorEl(event.currentTarget);
  };

  const { resourceTypeOptions } = useGetPersonalDevelopmentResourceTypeOptions();

  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const items: DropdownItem<ResourceType[]>[] = resourceTypeOptions
    .filter((item) => item.value !== ResourceType.LearningPlaylist)
    .map((priority) => ({
      ...priority,
      value: priority.value,
    }));
  const {
    openAddResourceModal,
    setCompetencyId,
    setResourceId,
    setPdpId,
  } = useAddResourceModalStore((state) => ({
    openAddResourceModal: state.openAddResourceModal,
    setCompetencyId: state.setCompetencyId,
    setResourceId: state.setResourceId,
    setPdpId: state.setPdpId,
  }));
  const { pushDrawer } = useDrawerActions();
  const { data } = useGetCompetencyList({ id: pdpId });
  const competencies = data?.response ?? [];
  const uniqueCompetencyNames = Array.from(new Set(competencies.map((item) => ({ id: item.id, name: item.name }))));

  const {
    transformedArray: competencyOptionTypes,
  } = GenerateCompetencyFilterData(uniqueCompetencyNames);
  const addResource = (resourceId: ResourceType, competencyIdSelected: number): void => {
    const fallbackCompetencyId = competencyOptionTypes[0].value as unknown as number;

    const shouldUseFallbackId = competencyIdSelected === OPTIMISTIC_ID;
    handleClose();
    if (resourceId === ResourceType.Learning || resourceId === ResourceType.LearningPlaylist) {
      handleClose();
      setCompetencyId(shouldUseFallbackId ? fallbackCompetencyId : competencyIdSelected);
      setPdpId(pdpId);
      pushDrawer({
        drawer: {
          ...personalDevelopmentShareLearningDrawer,
          args: {
            pdpId,
            competencyIdSelected: shouldUseFallbackId ? fallbackCompetencyId : competencyIdSelected,
          },
        },
      });
    } else if (resourceId === ResourceType.Feedback) {
      handleClose();
      setCompetencyId(shouldUseFallbackId ? fallbackCompetencyId : competencyIdSelected);
      setResourceId(resourceId);
      pushDrawer({
        drawer: {
          ...createIncompleteFeedbackTemplate,
          args: {
            pdpId,
          },
        },
      });
    } else if (shouldUseFallbackId) {
      openAddResourceModal(resourceId, fallbackCompetencyId);
    } else {
      openAddResourceModal(resourceId, competencyIdSelected);
    }
  };
  const hookProps = {
    showResourceOptions,
    handleClose,
    id,
    open,
    anchorEl,
    items,
    addResource,
    competencyId,
    isOptimisticallyUpdated,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
