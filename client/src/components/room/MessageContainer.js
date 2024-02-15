import './MessageContainer.css';

export default function MessageContainer({ messageList, user }) {
  const systemId = process.env.REACT_APP_DB_SYSTEM_USER_ID;

  return (
    <>
      <div>
        {messageList.map((message, index) => {
          return (
            <div key={message.index} className="each-message">
              {message.sender._id === systemId ? (
                <div className="system-message-container">
                  <p className="system-message">{message.content}</p>
                </div>
              ) : message.sender.email === user.email ? (
                <>
                  <div className="message-container mine">
                    <p className="message mine">{message.content}</p>
                  </div>
                  <p className="timestamp mine">{message.timestamp}</p>
                </>
              ) : (
                <>
                  <p className="name">{message.sender.name}</p>
                  <div className="message-container others">
                    <p className="message others">{message.content}</p>
                  </div>
                  <p className="timestamp others">{message.timestamp}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}