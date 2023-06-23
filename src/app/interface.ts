interface ApiGen {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: Usage;
    choices: Choice[];
}

interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}
export interface MessageData {
  fecha: String,
  message: Message[]
}
export interface Message {
  role: string;
  message: string;
}


interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}