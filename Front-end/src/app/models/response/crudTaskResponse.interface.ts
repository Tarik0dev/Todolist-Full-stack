export interface AddTaskResponseInterface {
  message: string;
}

export interface Task {
  id: number;
  description: string;
  is_done: boolean;
}

export interface GetAllTaskResponseInterface {
  total: number;
  ongoing: number;
  completed: number;
  result: Task[];
}
