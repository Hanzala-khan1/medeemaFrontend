import Image from "next/image";
import React, { useEffect, useState } from "react";
import avatar from "../../../public/images/avatar.png";
import {
  AiFillEye,
  AiFillMessage,
  AiFillCaretUp,
  AiFillCaretDown,
} from "react-icons/ai";
import { AiFillWechat } from "react-icons/ai";
import { auth, db, storage } from "../../firebase";
import Swal from "sweetalert2";
import { doc, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";

const CommentsCard = ({ name, message, time, replays, onReply }) => {
  // Add state to manage reply form visibility
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replies, setReplies] = useState([]); // getting all commennts reply
  const [userInfo, setUserInfo] = useState({}); // Store user information
  const MySwal = withReactContent(Swal);
  // getting username and his/her information
  useEffect(() => {
    // Function to fetch user information based on ID
    const fetchUserInfo = async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId); // Adjust 'users' to your Firestore collection name
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserInfo(userData);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem("id"); // Adjust 'userId' to your key name
    if (userId) {
      // Fetch user information based on the retrieved ID
      fetchUserInfo(userId);
    }
  }, []);

  // for comments reply
  // the reply will be send to the personname that we are getting from props
  // his document will be created inside askQuestions by the name prop
  // inside that all replies are stored
  const handleReply = async () => {
    try {
      // Check if the user is logged in
      if (!userInfo.username) {
        MySwal.fire({
          title: "Please login to reply.",
          confirmButtonColor: "#1A3578",
        });
        // alert('Please log in first.');
        return;
      }
      // Check if the reply message is empty
      if (!replyMessage) return;

      // Create a new reply object
      const newReply = {
        username: userInfo.username, // sender  username
        message: replyMessage,
        timestamp: new Date(),
      };

      // Add the new reply to Firestore under the user's "askQuestions" collection
      const userDocRef = doc(db, "askQuestions", name); // Assuming 'name' is the user's unique identifier
      await setDoc(
        userDocRef,
        {
          replies: arrayUnion(newReply), // Add the new reply to the 'replies' array
        },
        { merge: true } // Merge the data if the document already exists
      );

      // Clear the reply message input
      setReplyMessage("");
      // Close the reply form
      setIsReplying(false);

      // Call the onReply function if provided
      if (onReply) {
        onReply(replyMessage);
      }

      // Display a success message
      // alert('Reply sent successfully!');
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Fetch the replies from Firestore and update the state
  const fetchReplies = async () => {
    try {
      const userDocRef = doc(db, "askQuestions", name);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.replies) {
          setReplies(userData.replies);
        }
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [replies]);

  var myDate = new Date(time?.seconds * 1000);
  var formatedTime = myDate.toJSON();

  let date = formatedTime?.slice(0, 10);

  return (
    <div className=" ">
      <div className="grid grid-cols-[1fr_3fr] grid-rows-[8fr_1fr] md:grid-rows-1 sm:grid-cols-[1fr_8fr] gap-2 bg-white px-4 py-4 border  ">
        <div className="flex flex-col items-center justify-between">
          {/* <Image src="/hello.png" width={40} height={40}alt="avatar"  className=' h-[60px] w-[60px] md:h-[80px] md:w-[80px]' /> */}
          <div className="h-[50px] w-[50px] bg-[#1A3578] rounded-full text-white flex justify-center items-center capitalize text-xl">
            <p>{name ? name.slice(0, 1) : "NA"}</p>
          </div>
          <div className="flex flex-col text-2xl items-center my-auto text-[#B8B8B8] ">
            <AiFillCaretUp />
            <h2 className="text-[#CDF27E] font-bold">04</h2>
            <AiFillCaretDown />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <h2 className="text-[#1A3578] capitalize">{name}</h2>
              <h2 className="text-[#1A3578]">{date}</h2>
            </div>
            <button className="hidden md:block text-[#1A3578] px-2 md:px-4 py-2">
              <AiFillWechat className="text-[30px]" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-[#1A3578] first-letter:capitalize">
            {message}
          </h2>
          <h3 className="text-[#777777]">
            {replies && replies.length > 0 ? (
              replies.map((reply, index) => (
                <div key={index}>
                  {reply.username}
                  {/* {index + 1} */}:{reply.message}
                </div>
              ))
            ) : (
              <div>No replies yet.</div>
            )}
          </h3>
          <div className="hidden md:flex  bg-[#F1F6F9] justify-between md:mx-6 p-2">
            {/* reply messsage */}
            {/* Display reply form when isReplying is true */}
            {isReplying ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Your reply..."
                  className="border border-gray-300 rounded-md p-2 flex-grow"
                />
                <button
                  className="bg-[#1A3578] px-4 py-2 text-white rounded-md flex items-center gap-1"
                  onClick={handleReply}
                >
                  <span>
                    <AiFillMessage />
                  </span>
                  Reply
                </button>
              </div>
            ) : (
              // Display reply button when not replying
              <button
                className="bg-[#1A3578] px-4 md:px-4 py-2 text-white rounded-md flex items-center gap-1"
                onClick={() => setIsReplying(true)}
              >
                <span>
                  <AiFillMessage />
                </span>
                Reply now
              </button>
            )}
            <button className="bg-[#CDF27E] px-4 md:px-6 py-2 text-black rounded-md flex items-center gap-2">
              {" "}
              <span>
                <AiFillEye />
              </span>
              03 Views
            </button>
          </div>
        </div>
        <div className="flex md:hidden col-span-2 bg-[#F1F6F9] justify-between md:mx-6 p-2">
          <button className="bg-[#1A3578] px-8 md:px-4 py-2 text-white rounded-md flex items-center gap-1">
            <span>
              <AiFillMessage />
            </span>{" "}
            10 Answers
          </button>
          <button className="bg-[#CDF27E] px-9 md:px-6 py-2 text-black rounded-md flex items-center gap-2">
            {" "}
            <span>
              <AiFillEye />
            </span>
            03 Views
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsCard;
