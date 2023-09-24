# E-Shop
Open two terminals: 
  Terminal -1:
    -> npm install
    -> cd E-Shop/client/
    -> npm run dev
  Terminal -2: 
    -> npm install
    -> cd E-Shop/server/
    -> create .env file and ADD these lines
      -> API_URL = /api/v1
      -> MONGO_CONNECTION_STRING = mongodb+srv://<username>:<password>@cluster0.27fyvea.mongodb.net/?retryWrites=true&w=majority   {Note: Add your username and password of MongoDb Collection in this line}
      -> secret = {Note: Keep any random value Ex:sdfngf@g1742He}
    -> npm start

-> Thats it😁
      
