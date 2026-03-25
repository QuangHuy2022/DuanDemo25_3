const app = require('./app');
const { connectDB } = require('./db/index');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
