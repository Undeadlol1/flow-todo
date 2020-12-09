export type TaskHistory = {
  userId: string;
  taskId: string;
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
