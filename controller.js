// controller.js

const getAllOptions = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM master_options', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const incrementVoteCount = (connection, optionId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'UPDATE master_options SET vote_count = vote_count + 1 WHERE id = ?',
            [optionId],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};

module.exports = {
    getAllOptions,
    incrementVoteCount
};
