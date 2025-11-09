export type { AppModel } from '@sheplang/language';

export type GenFile = { path: string; content: string };
export type GenResult = { appName: string; files: GenFile[] };
