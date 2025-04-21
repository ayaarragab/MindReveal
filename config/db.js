import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGO_URI;


class DBClient{
    static async getConnection() {
        try {
            const conn = await mongoose.connect(URI);            
            return conn;
        } catch (error) {
            console.log(error);            
        }
    }
}

export default DBClient;
