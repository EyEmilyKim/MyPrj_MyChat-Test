const Message = require('../models/message');
const { dateFormatKST } = require('../utils/dateFormatKST');
const messageService = {};

// 기존 메세지 조회
messageService.getAllMessages = async function (rid) {
  // console.log('messageService.getAllMessages called', rid);
  try {
    const messageList = await Message.find({ room: rid });
    // console.log('messageList', messageList);
    return messageList;
  } catch (error) {
    // console.log('messageService.getAllMessages error', error);
    throw new Error(error.message);
  }
};

// 메세지 저장
messageService.saveMessage = async function (msg, uid, rid) {
  // console.log('messageService.saveMessage called');
  try {
    const now = await dateFormatKST();
    const newMsg = new Message({
      room: rid,
      sender: uid,
      content: msg,
      timestamp: now,
    });
    await newMsg.save();
    // console.log('newMsg', newMsg);
    return newMsg;
  } catch (error) {
    // console.log('messageService.saveMessage error : ', error);
    throw new Error(error.message);
  }
};

// 시스템 메세지 저장 후 index 반환
messageService.saveSystemMessage = async function (msg, uid, rid) {
  // console.log('messageService.saveSystemMessage called');
  try {
    const now = await dateFormatKST();
    const newMsg = new Message({
      room: rid,
      sender: uid,
      content: msg,
      timestamp: now,
    });
    const newMsgSaved = await newMsg.save();
    const newMsgIndex = newMsgSaved.index;
    console.log('newMsgIndex', newMsgIndex);
    return newMsgIndex;
  } catch (error) {
    // console.log('messageService.saveSystemMessage error : ', error);
    throw new Error(error.message);
  }
};

module.exports = messageService;
