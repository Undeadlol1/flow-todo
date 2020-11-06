
export type TaskHistory = {
  createdAt: number;
  comment?: string;
  actionType: 'postpone' |
  'updateName' |
  'updateSubtask' |
  'stepForward' |
  'leapForward' |
  'setDone';
};
