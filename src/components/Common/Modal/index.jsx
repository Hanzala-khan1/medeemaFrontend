import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { BsFillPostcardFill } from "react-icons/bs";
import { RiVisaLine } from "react-icons/ri";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("*");

const ModalPage = ({ state, Button }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  useEffect(() => {
    if (state == true) {
      openModal();
    }
  }, [state]);
  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#F1F6F9';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={state}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex flex-col gap-3 px-4 py-4 rounded-lg">
          <div className="px-4 sm:px-0">
            <div className="fixed top-4 text-end right-6">
              <Button />
            </div>
            <h2 className="tex-lg font-semibold ">Payment Details</h2>
            <h2>To skipp ads please subscribe </h2>
          </div>
          <div className="flex bg-[#F1F6F9] py-2 px-2">
            <button className="bg-[#F7B614] flex items-center gap-2 px-12 py-3 rounded-md">
              <div className="text-xl text-white">
                <BsFillPostcardFill />
              </div>
              <h2>Pay by card</h2>
            </button>
            <button className="px-12 py-3">Direct pay</button>
          </div>
          <div className="flex flex-col gap-1 px-4 sm:px-0">
            <label>Email Adress</label>
            <input
              type="text"
              placeholder="John Doe@email.com"
              className="py-2 px-2 outline-none border"
            />
          </div>
          <div className="bg-[#F1F6F9] px-2 py-2">
            <div className="flex flex-col gap-1">
              <label>Card Number</label>
              <div className="flex items-center justify-between bg-white border">
                <input
                  type="text"
                  placeholder="1231 232 3245 4567"
                  className="rounded-md  text-start w-72 py-2 px-2 outline-none "
                />
                <div className="text-3xl  text-center px-2">
                  <RiVisaLine />
                </div>
                <div></div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="flex flex-col gap-1 ">
                  <label className="px-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="2/24"
                    className="rounded-md py-2 px-2 outline-none border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="px-2">CVC</label>
                  <input
                    type="text"
                    placeholder="..."
                    className="rounded-md py-2 px-2 outline-none border"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="px-2">Card holder name</label>
                  <input
                    type="text"
                    placeholder="Joh Doe"
                    className="rounded-md py-2 px-2 outline-none border"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-0">
            <button className="text-white rounded-md bg-[#F7B614] w-full py-3">
              Pay Now
            </button>
          </div>
        </div>
        {/* <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form> */}
      </Modal>
    </div>
  );
};

export default ModalPage;
