const mongoose=require('mongoose');

const connectDB=async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`.red.bold);
        process.exit();
    }

}
module.exports=connectDB;