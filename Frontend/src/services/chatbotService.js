import api from "./api";

export const askChatbot = (message, history = []) =>
  api.post("/chatbot", { message, history }).then((res) => res.data);
