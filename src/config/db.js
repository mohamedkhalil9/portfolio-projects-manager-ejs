import mongoose from 'mongoose';

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`db connect on ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err)
    })
}

export default dbConnect;
