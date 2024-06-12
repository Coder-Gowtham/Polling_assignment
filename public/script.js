const socket = io();

// Handle voting
function vote(option) {
    socket.emit('vote', option);
}

socket.on('voteUpdate', (voteData) => {
    // Update the poll interface with the new vote data
    document.getElementById('pollOptions').innerText = JSON.stringify(voteData);
});

// Handle chat
function sendMessage() {
    const message = document.getElementById('messageInput').value;
    socket.emit('chatMessage', message);
    document.getElementById('messageInput').value = '';
}

socket.on('chatMessage', (msg) => {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.innerText = msg;
    chatMessages.appendChild(messageElement);
});

// Handle typing indicator
function showTyping() {
    socket.emit('typing', 'User is typing...');
}

socket.on('typing', (username) => {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.innerText = username;
    setTimeout(() => typingIndicator.innerText = '', 3000);
});
