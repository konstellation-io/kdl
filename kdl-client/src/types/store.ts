export type StoreUpdate = {
  key: 'servers' | 'workspace';
  value: any;
};

export enum StoreKey {
  SERVERS = 'servers',
  WORKSPACE = 'workspace',
}
