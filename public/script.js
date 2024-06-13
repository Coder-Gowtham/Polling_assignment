const socket = io();

// Log the connection
socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

// Receive initial poll data
socket.on('pollData', (data) => {
    const questionDiv = document.querySelector('.question');
    if (questionDiv) {
        questionDiv.textContent = data.question;
    }

    data.options.forEach(option => {
        const optionElement = document.querySelector(`input[value="${option.id}"]`);
        if (optionElement) {
            const label = optionElement.nextElementSibling;
            const voteCount = label.querySelector('span');
            if (voteCount) {
                voteCount.textContent = option.vote_count;
            }
        }
    });
});

// Show a notification when the user has already voted
socket.on('alreadyVoted', () => {
    alert("You have already voted. Please click OK to continue.")
});


// Submit a vote
function submitVote(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('input[name="username"]').value;
    const selectedOption = document.querySelector('input[name="pollOption"]:checked');

    if (selectedOption && username) {
        // Emit the vote to the server
        socket.emit('vote', {
            selectedOption: selectedOption.value,
            username: username
        });

        // Disable the submit button
        const submitButton = document.querySelector('#pollForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }

        // Disable all radio buttons
        const radioButtons = document.querySelectorAll('input[name="pollOption"]');
        radioButtons.forEach(button => button.disabled = true);
    } else {
        console.log('No option selected or username missing');
    }
}

// Listen for vote updates from the server
socket.on('voteUpdate', (updatedOptions) => {
    updatedOptions.forEach(option => {
        const voteCountSpan = document.getElementById(`count${option.id}`);
        if (voteCountSpan) {
            voteCountSpan.textContent = option.vote_count;
        }
    });
});

//************************************************************************************************************************************************************************** */


// Handle incoming chat messages
socket.on('chatMessage', (msg) => {
    const chatMessagesDiv = document.getElementById('chatMessages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message-box');

    // Split message into username and text
    const [username, ...messageText] = msg.split(' ');
    const usernameSpan = document.createElement('span');
    usernameSpan.classList.add('chat-username');
    usernameSpan.textContent = username;

    const messageSpan = document.createElement('span');
    messageSpan.classList.add('chat-message');
    messageSpan.textContent = messageText.join(' ').trim(); // Join and trim the remaining message parts

    newMessageDiv.appendChild(usernameSpan);
    newMessageDiv.appendChild(document.createTextNode(' ')); // Add colon separator
    newMessageDiv.appendChild(messageSpan);

    if (chatMessagesDiv) {
        chatMessagesDiv.appendChild(newMessageDiv);
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Auto-scroll to the bottom
    }
});

// Send a chat message
function sendMessage(username) {
    const messageInput = document.getElementById('messageInput');
    const newUsername = username.split("@")[0];
    const message = `${newUsername} ${messageInput.value.trim()}`;

    if (messageInput.value.trim() !== '') {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
}


// Show typing indicator
function showTyping() {
    socket.emit('typing', 'A user is typing...');
}

// Handle typing indicator
socket.on('typing', (message) => {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.textContent = message;
        setTimeout(() => {
            typingIndicator.textContent = '';
        }, 2000);
    }
});
