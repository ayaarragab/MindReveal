import mongoose from 'mongoose';

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
