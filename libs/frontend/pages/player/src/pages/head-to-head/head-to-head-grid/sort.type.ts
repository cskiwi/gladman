import { Player } from '@app/models';

export type HeadToHeadGrid = {
  player: Pick<Player, 'id' | 'fullName'>;
  winRate: number;
  amountOfGames: number;
  club?: { id: string; name: string };
  partner?: Pick<Player, 'id' | 'fullName'>;
  partnerClub?: { id: string; name: string };
};
