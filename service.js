// service.js

// Function to get all options
const getAllOptions = (pool) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM master_options', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.rows); // Access rows from results
        });
    });
};

const getIsVoted = (pool, username) => {

    console.log(`qqqqqqqqqqqqqqqqqqq`, username);
    console.log(`ENTERING TO getIsVoted`);
    const sql = `SELECT is_voted FROM registered_users WHERE email = '${username}'`;
    console.log('sql', sql);
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(`results`, results

            );
            resolve(results.rows); // Access rows from results
        });
    });
};

// Function to increment vote count
const incrementVoteCount = (pool, optionId, username) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE master_options SET vote_count = vote_count + 1 WHERE id = $1 RETURNING vote_count;`,
            [optionId],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.rows[0].vote_count); // Return the updated vote count
            }
        );
    });
};

const updateIsVoted = (pool, username, selectedOption) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE registered_users SET is_voted = 1, selected_option = $1 WHERE email = $2;`,
            [selectedOption,username],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(1); // Return the updated vote count
            }
        );
    });
};

module.exports = {
    getAllOptions,
    incrementVoteCount,
    getIsVoted,
    updateIsVoted,
    
};
