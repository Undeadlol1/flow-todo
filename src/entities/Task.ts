import { Subtask } from './Subtask';
import { TaskHistory } from './TaskHistory';

export type Task = {
  id: string;
  name: string;
  userId: string;
  note?: string;
  isDone: boolean;
  isCurrent?: boolean;
  repetitionLevel?: number;
  subtasks?: Subtask[];
  history?: TaskHistory[];
  tags?: string[];
  dueAt: number;
  doneAt?: number;
  createdAt: number;
  updatedAt?: number;
};
