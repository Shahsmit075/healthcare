const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log('Using connection string:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    await client.connect();
    console.log('Successfully connected to database!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await client.end();
  }
}

testConnection(); 