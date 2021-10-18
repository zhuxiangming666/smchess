export interface IPosition {
  X: number;
  Y: number;
}
export enum IDirection {
  DOWN = 'DOWN',
  TOP = 'TOP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  RIGHT_TOP = 'RIGHT_TOP',
  RIGHT_DOWN = 'RIGHT_DOWN',
  LEFT_DOWN = 'LEFT_DOWN',
  LEFT_TOP = 'LEFT_TOP'
}