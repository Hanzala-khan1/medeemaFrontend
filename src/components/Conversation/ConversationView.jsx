import { addmessages, getchats, getmessages } from '@/services';
import React, { use, useEffect, useState } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ConversationView = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [Chats, setChats] = useState([]);
  const [message, SetMessages] = useState([]);
let [sendMessage,setSendMessage]=useState("")
  const [activePerson, setActivePerson] = useState(null);
  const [friendsName, setFriendsName] = useState('');

  const Userdata = JSON.parse(localStorage.getItem("user"))
  const MySwal = withReactContent(Swal);

  const getallchats = async () => {
    try {
      MySwal.showLoading();

      let user_data;
      user_data = await getchats()

      if (!user_data) {
        MySwal.fire({
          icon: "info",
          // title: 'Oops...',
          text: "No Data found",
        });
      }
      MySwal.hideLoading();
      setChats(user_data.data.chatRoom)


      MySwal.close();
    } catch (error) {
      console.log(error)
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });
    }

  };
  useEffect(() => {
    getallchats()
    // if (activeChat) {
    //   const intervalId = setInterval(() => {
    //     getallmessages();
    //   }, 2000); // 2000 milliseconds = 2 seconds

    //   // Clean up interval on component unmount to prevent memory leaks
    //   return () => clearInterval(intervalId);
    // }
  }, [])
  const handlePersonClick = (chatId) => {
    // if (!person.classList.contains('active')) {
    //   setActiveChat(person.getAttribute('data-chat'));
    //   setActivePerson(person);

    //   // Update active class for chat and person elements
    //   document.querySelector('.active').classList.remove('active');
    //   person.classList.add('active');

    //   // Update chat container with the active chat
    //   const chatContainer = document.querySelector('.container .right');
    //   const chatToActivate = chatContainer.querySelector(`[data-chat="${person.getAttribute('data-chat')}"]`);
    //   chatContainer.querySelector('.active-chat').classList.remove('active-chat');
    //   chatToActivate.classList.add('active-chat');

    //   // Update friends' name in chat header
    //   setFriendsName(person.querySelector('.name').innerText);
    // }
    setActiveChat(chatId)
    getallmessages(chatId)
  };

  console.log("lelelelleleleleel", message, message.length)
  const getallmessages = async (chatId) => {
    try {
      // MySwal.showLoading();

      let user_data;
      let params = {
        chatId: chatId
      }
      console.log("params", params)
      let allmessages = await getmessages(params)
      console.log("ttttttttttttttttttvvvvvvvvvvvvvvvv", user_data)
      // MySwal.close();
      // return
      // if (!user_data) {
      //   MySwal.fire({
      //     icon: "info",
      //     // title: 'Oops...',
      //     text: "No Data found",
      //   });
      // }
      SetMessages(allmessages.data)
      MySwal.hideLoading();


      MySwal.close();
    } catch (error) {
      console.log(error)
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });
    }
  }
  const messageinputchange=(e)=>{
    setSendMessage(e.target.value)
  }
  const hanldeSendMessage=async (e)=>{
    e.preventDefault()
    try {
      // MySwal.showLoading();

      let user_data;
      let params = {
        chatId: activeChat,
        message:sendMessage,
      }
      let allmessages = await addmessages(params)
      if (!allmessages) {
        MySwal.fire({
          icon: "info",
          // title: 'Oops...',
          text: "No Data found",
        });
      }
      MySwal.hideLoading();
      SetMessages([...message,allmessages.data])
      setSendMessage("")
      // MySwal.close();
    } catch (error) {
      console.log(error)
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });
    }
  }

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left">
          <div className="top">
            <input type="text" placeholder="Search" />
            <a href="javascript:;" className="search"></a>
          </div>
          <ul className="people">
            {Chats.length && (
              Chats.map((chatusers) => {
                let showUser = chatusers.users.filter((user) => {
                  console.log("usssssssssssseeeeeeeeeeeeeeeeerrrrrrrr", user._id.toString(), Userdata._id)
                  return (user._id.toString() !== Userdata._id)
                })
                showUser = showUser[0].full_name

                return (
                  <li className={`person ${activeChat== chatusers._id.toString()?"active":""}`} data-chat="person1" onClick={() => handlePersonClick(chatusers._id.toString())}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/thomas.jpg" alt="" />
                    <span className="name">{showUser}</span>
                    <span className="time">{chatusers.created_at}</span>
                    {/* <span className="preview">I was wondering...</span> */}
                  </li>
                )
              })

            )}
          </ul>
        </div>
        <div className="right">
          {/* Chat header */}
          <div className="top"><span>To: <span className="name">{friendsName}</span></span></div>
          {/* Chat messages */}
          <div className="chat active-chat" style={{
            overflowY: "auto"
          }}>

            {message.length && message.map((messageword) => {
              let isme;
              isme = Userdata._id == messageword.to_user.toString()
              return (
                <>
                  <div key={messageword._id.toString()} class={`bubble ${isme ? "you" : "me"}`}>
                    <p>{messageword.message}</p>
                    <p>{messageword.created_at}</p>
                  </div>
                </>
              )
            })}
          </div>
          {/* Input area for typing messages */}
          <div className="write">
            <a href="javascript:;" className="write-link attach"></a>
            <input type="text"  value={sendMessage} onChange={messageinputchange}/>
            <a  className="write-link smiley"></a>
            <a  className="write-link send" onClick={hanldeSendMessage}></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
