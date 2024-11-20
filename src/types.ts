export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  order: number;
}

export type FilterType = 'all' | 'active' | 'completed';