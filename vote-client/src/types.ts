// src/types.ts
export interface Vote {
  id: number;
  poll_id: number;
  option: string;
  created_at: string;
}

export interface Poll {
  id: number;
  title: string;
  created_at: string;
  options: string[];    
  votes: Vote[];
}
