import { PonyModel, PonyWithPositionModel } from './PonyModel';

export interface RaceModel {
  id: number;
  name: string;
  ponies: Array<PonyModel>;
  startInstant: string;
  betPonyId?: number | null;
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
}

export interface LiveRaceModel {
  ponies: Array<PonyWithPositionModel>;
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
}
