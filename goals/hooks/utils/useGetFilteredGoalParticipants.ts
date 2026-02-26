import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';

interface GetFilteredGoalParticipantsProps {
  goal: Goals.Goal,
}

interface GetFilteredGoalParticipantsReturn {
  participants: Goals.GoalParticipant[],
}

const useGetFilteredGoalParticipants = ({ goal }: GetFilteredGoalParticipantsProps): GetFilteredGoalParticipantsReturn => {
  const participants = useMemo(() => ([
    ...(goal?.participants || [1]),
    ...(goal?.implicitParticipants || []).filter(
      (participant) => !(participant.firstName.toLowerCase() === 'josh' && participant.lastName.toLowerCase() === 'coach'),
    ),
  ]), [goal?.participants, goal?.implicitParticipants]);

  return {
    participants,
  };
};

export default useGetFilteredGoalParticipants;
