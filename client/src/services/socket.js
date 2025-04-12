import io from 'socket.io-client';

let socket;

// Get the current hostname to support both localhost and network access
const getServerUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
  const hostname = window.location.hostname;
  return `${protocol}${hostname}:5000`; // Backend runs on port 5000
};

export const initiateSocket = () => {
  console.log('Connecting to socket...');
  socket = io(getServerUrl(), {
    withCredentials: true,
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('token')
    }
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('user_connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const joinChat = (chatId) => {
  if (socket && chatId) {
    socket.emit('join_chat', chatId);
  }
};

export const sendSocketMessage = (messageData) => {
  if (socket) {
    socket.emit('send_message', messageData);
  }
};

export const subscribeToMessages = (callback) => {
  if (socket) {
    socket.on('receive_message', (message) => {
      callback(message);
    });
  }
};

export const subscribeToUserConnections = (callback) => {
  if (socket) {
    socket.on('user_connected', (userData) => {
      callback(userData);
    });
  }
};

export const getSocket = () => socket;