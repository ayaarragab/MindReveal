import mongoose from 'mongoose';
import Thought from './models/thought.js';
import User from './models/user.js';
import DBClient from "./config/db.js";

await DBClient.getConnection();

// Configuration
const USER_ID = '6804cd08b17becbfa7f17fd6';
const TOTAL_THOUGHTS = 33337;
const BATCH_SIZE = 1000; // Process thoughts in batches to avoid memory issues

async function assignThoughts() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log(`Starting to assign ${TOTAL_THOUGHTS} thoughts to user ${USER_ID}`);

        // Find the user
        const user = await User.findById(USER_ID).session(session);
        if (!user) {
            throw new Error('User not found');
        }

        // Initialize thoughts array if it doesn't exist
        if (!user.thoughts) {
            user.thoughts = [];
        }

        let thoughtsCreated = 0;

        // Process thoughts in batches
        for (let i = 0; i < TOTAL_THOUGHTS; i += BATCH_SIZE) {
            const batchSize = Math.min(BATCH_SIZE, TOTAL_THOUGHTS - i);
            const thoughtsBatch = [];

            // Create batch of thoughts
            for (let j = 0; j < batchSize; j++) {
                thoughtsBatch.push({
                    content: `Test thought ${i + j + 1}`,
                    created_at: new Date()
                });
            }

            // Insert batch of thoughts
            const thoughts = await Thought.insertMany(thoughtsBatch, { session });
            const thoughtIds = thoughts.map(thought => thought._id);

            // Add thought IDs to user's thoughts array
            user.thoughts.push(...thoughtIds);
            thoughtsCreated += batchSize;

            console.log(`Created batch of ${batchSize} thoughts. Total: ${thoughtsCreated}`);
        }

        // Save the user with updated thoughts array
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        console.log(`Successfully assigned ${thoughtsCreated} thoughts to user ${USER_ID}`);

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error('Error assigning thoughts:', error.message);
        throw error;

    } finally {
        // End the session
        session.endSession();
    }
}

// Execute the script
(async () => {
    try {
        await assignThoughts();

    } catch (error) {
        console.error('Script execution failed:', error.message);

    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
})();