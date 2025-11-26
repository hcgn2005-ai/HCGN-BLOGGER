export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string; // ISO String YYYY-MM-DD
  createdAt: number;
}

export interface DateStats {
  [date: string]: number; // date -> count of posts
}

export enum ViewMode {
  READING = 'READING',
  EDITING = 'EDITING'
}
