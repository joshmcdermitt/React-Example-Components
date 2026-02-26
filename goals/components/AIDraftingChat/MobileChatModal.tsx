import JoshModal from '~Common/V3/components/JoshModal';
import useAIDraftingStore from '~Goals/stores/useAIDraftingStore';
import AIDraftingChat from './AIDraftingChat';

const MobileChatModal = (): JSX.Element => {
  const { showObjectivesAIDraftingTool, setShowObjectivesAIDraftingTool } = useAIDraftingStore();
  return (
    <JoshModal
      open={showObjectivesAIDraftingTool}
      onClose={() => setShowObjectivesAIDraftingTool(false)}
      fullWidth={false}
    >
      <AIDraftingChat />
    </JoshModal>
  );
};

export default MobileChatModal;
