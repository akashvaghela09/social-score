import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
// required('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
console.log("privateKey: ", privateKey);
const wallet = new Wallet(privateKey);
const provider = getDefaultProvider(process.env.ALCHEMY_URL);

const signer = wallet.connect(provider);

// Connect to the database
const db = new Database({ signer });

const healthCheckTableName = "healthbot_80001_1"; // Our pre-defined health check table
const ssTable = "my_ss_table_80001_7046";
const userTable = "User_80001_7048";
const prefix = "my_ss_table";

const readTable = async (tableName) => {
    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    console.log("results: ", results);
}

const writeTable = async () => { // my_ss_table_80001_7046

    const { meta: create } = await db
        .prepare(`CREATE TABLE ${prefix} (id integer primary key, name text);`)
        .run();

    // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
    console.log(create.txn.name); // e.g., my_sdk_table_80001_311
}

const createUserTable = async () => {
    try {
        // Prepare the SQL statement to create the User table
        const stmt = db.prepare(`CREATE TABLE User (
                                user_id INTEGER PRIMARY KEY,
                                name TEXT,
                                wallet_address TEXT,
                                is_banned INTEGER,
                                social_score INTEGER,
                                external_url TEXT
                              );`);

        // Execute the statement to create the table
        const { meta } = await stmt.run();
        console.log("meta: ", meta);
    } catch (error) {
        console.error('An error occurred while creating the User table:', error);
    }
};

const addUser = async (userId, name, walletAddress, isBanned, socialScore, externalURL) => {
    try {
        const { meta: insert } = await db.prepare(`INSERT INTO ${userTable} (user_id, name, wallet_address, is_banned, social_score, external_url) VALUES (?, ?, ?, ?, ?, ?);`)
            .bind(userId, name, walletAddress, isBanned, socialScore, externalURL)
            .run();

        // Wait for transaction finality
        await insert.txn.wait();

    } catch (error) {
        console.error('An error occurred while adding the user:', error);
    } finally {
        console.log('Add user transaction complete...');
    }
};


const getUser = async (userId) => {
    try {
        // Prepare the SQL statement to select a user from the User table
        const stmt = db.prepare(`SELECT * FROM User WHERE user_id = ?;`);

        // Bind the parameter value to the statement
        stmt.bind(userId);

        // Retrieve the user data
        const { results } = await stmt.all();

        // Check if the user exists
        if (results.length > 0) {
            const user = results[0];
            console.log('User found:', user);
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving the user:', error);
    }
};


// writeTable();
// createUserTable();

// addUser(Date.now(), "test", "0x11", 0, 0, "test");


// readTable(ssTable);
readTable(userTable);
