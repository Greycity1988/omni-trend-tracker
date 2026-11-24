/**
 * A change in percent, or null when it could not be measured: Google Trends and Naver DataLab
 * report 0 for "too little search volume", so a change to or from 0 has no meaningful percentage.
 */
export type Change = number | null | undefined;

export const TOO_LITTLE_DATA = '데이터 부족';

export const changeText = (v: Change): string =>
  v == null ? TOO_LITTLE_DATA : v > 0 ? `+${v}%` : `${v}%`;

/** 'up' | 'down' | 'flat' for a measured change, 'none' when there is too little data. */
export const changeTone = (v: Change): 'up' | 'down' | 'flat' | 'none' =>
  v == null ? 'none' : v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
