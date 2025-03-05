export const WS_URL = window.location.hostname === "localhost" 
  ? "ws://localhost:3000"
  : "wss://definitely-handy-cow.ngrok-free.app";

  export const HTTP_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://definitely-handy-cow.ngrok-free.app";
