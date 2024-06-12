// script.js

const socket = io();

// Log the connection
socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

// Receive initial poll data
socket.on('pollData', (data) => {
    const questionDiv = document.querySelector('.question');
    questionDiv.textContent = data.question;

    data.options.forEach(option => {
        const optionElement = document.querySelector(`input[value="${option.id}"]`);
        if (optionElement) {
            const label = optionElement.nextElementSibling;
            const voteCount = label.querySelector('span');
            voteCount.textContent = option.vote_count;
        }
    });
});

// Submit a vote
function submitVote(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the selected option
    const selectedOption = document.querySelector('input[name="pollOption"]:checked');
    
    if (selectedOption) {
        // Emit the vote to the server
        socket.emit('vote', selectedOption.value);

        // Disable the submit button
        const submitButton = document.querySelector('#pollForm button[type="submit"]');
        submitButton.disabled = true;

        // Disable all radio buttons
        const radioButtons = document.querySelectorAll('input[name="pollOption"]');
        radioButtons.forEach(button => button.disabled = true);
    } else {
        console.log('No option selected');
    }
}

// Listen for vote updates from the server
socket.on('voteUpdate', (updatedOptions) => {
    updatedOptions.forEach(option => {
        const voteCountSpan = document.getElementById(`count${option.id}`);
        console.log(`voteCountSpan || ${JSON.stringify(voteCountSpan)}`, voteCountSpan);
            if (voteCountSpan) {
                voteCountSpan.textContent = option.vote_count;
            }
    });
});

// Handle incoming chat messages
socket.on('chatMessage', (msg) => {
    const chatMessagesDiv = document.getElementById('chatMessages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.textContent = msg;
    chatMessagesDiv.appendChild(newMessageDiv);
});

// Send a chat message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
}

// Show typing indicator
function showTyping() {
    socket.emit('typing', 'A user is typing...');
}

// Handle typing indicator
socket.on('typing', (username) => {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.textContent = username;
    setTimeout(() => {
        typingIndicator.textContent = '';
    }, 2000);
});
