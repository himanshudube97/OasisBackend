
import mongoose from "mongoose";
const connectDatabase = async (DB_URL) => {
  mongoose
    .connect(DB_URL)
    .then((data) => {
      console.log(`Mongodb connected with server ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err, "error");
    });
};

export default connectDatabase;
