export const getConversationId = (user1: string, user2: string) => {
  return `conv-${[user1, user2].sort().join("-")}`; // order-independent
};