export interface Feedback {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export const feedbackStore: Feedback[] = [];