// service.js

// Fetch all options from the database
const getAllOptions = (connection, callback) => {
    const query = 'SELECT * FROM master_options';
    connection.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Update the vote count for a specific option
const updateVote = (connection, id, callback) => {
    const updateQuery = 'UPDATE master_options SET vote_count = vote_count + 1 WHERE id = ?';
    connection.query(updateQuery, [optionName], (err) => {
        if (err) {
            return callback(err, null);
        }
        // Fetch updated options after vote update
        getAllOptions(connection, callback);
    });
};

module.exports = {
    getAllOptions,
    updateVote,
};
