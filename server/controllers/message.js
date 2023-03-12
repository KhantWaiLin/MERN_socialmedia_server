import Message from "../models/Message.js";

export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    console.log(chatId);

    try {
        const newMessage = new Message({
            chatId,
            senderId,
            text,
        });



        const result = await newMessage.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}