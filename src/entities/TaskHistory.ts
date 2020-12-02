export type TaskHistory = {
  createdAt: number;
  comment?: string;
  actionType:
    | 'postpone'
    | 'updateName'
    | 'doneSubtask'
    | 'updateSubtask'
    | 'stepForward'
    | 'leapForward'
    | 'setDone';
};
