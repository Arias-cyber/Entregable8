import messageModel from "../models/message";

export default  class MessagesManager{
    getMessages=(params) =>{
        return messageModel.find().lean();
    }
    createMessage = (message) => {
        return messageModel.create(message)
    }
}