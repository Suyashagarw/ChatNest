// @ts-check
import React, { useMemo, useState } from "react";
import ChatListItem from "./components/ChatListItem";
import Footer from "./components/Footer";
import { addRoom, getRooms } from "../../../../api";

const ChatList = ({ rooms, dispatch, user, currentRoom, onLogOut }) => {
  // useEffect(() => {
  //   // console.log("Initial rooms:", rooms); // Check what's in the initial rooms prop
  //   // setRoomsData(rooms)
  // }, [rooms]);
  const [setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [setRoomsData] = useState(rooms);
  
  // const users = [

  //   { name: "naqib.bueteee@gmail.com", userId: "65683a0ff1709c28d37c1ff8" },
  //   { name: "naqib3110@gmail.com", userId: "65683891cbb60fe409f2d724" },

  // ];
  // const handleChange = (e) => {
  //   e.preventDefault();
  //   console.log(e)
  //   setSearchInput(e.target.value);
  // };
  // const handleChange = async (e) => {
  //   e.preventDefault();
  //   setSearchInput(e.target.value);
  //   console.log(e)
  //   if (e.target.value > 10) {
  //     setSearchResults(e.target.value);
  //   } else {
  //     setSearchResults([]);
  //   }
  // };

  // const handleChange = async (e) => {
  //   e.preventDefault();
  //   setSearchInput(e.target.value);
  // };

  // const handleKeyPress = async (e) => {
  //   if (e.key === 'Enter') {
  //     const userData = await userSearch(e.target.value.toLowerCase());
  //     console.log({email:e.target.value.toLowerCase(), userId: userData.data.userId})
  //     setSearchResults(userData.data ? [{email:e.target.value.toLowerCase(), userId: userData.data.userId}] : []);
  //   } else {
  //     setSearchResults([]);
  //   }
  // };

  // if (searchInput.length > 3) {
  //   console.log('x');
  //   users.filter((country) => {
  //     console.log(country.name.match(searchInput))
  //     return country.name.match(searchInput);
  //   });
  // }

  const handleUserSelect = async (userInfo) => {
    await addRoom(localStorage.getItem('userId'), userInfo.split("-")[1], localStorage.getItem('username'), userInfo.split("-")[0])
    const updatedRooms = await getRooms(localStorage.getItem('userId'))
    console.log(updatedRooms)
    setRoomsData(updatedRooms); // Update the rooms data
    setSearchInput('');
    setSearchResults([]);
  };

  // const handleCountrySelect = (user) => {
  //   setSearchInput(user);
  //   // You might also want to clear the search results or perform other actions
  //   setSearchResults([]);
  // };
  const processedRooms = useMemo(() => {
    const roomsList = Object.values(rooms);
    const main = roomsList.filter((x) => x.id === "0");
    let other = roomsList.filter((x) => x.id !== "0");
    console.log(other)
    other = other.sort(
      (a, b) => +a.id.split(":").pop() - +b.id.split(":").pop()
    );
    return [...(main ? main : []), ...other];
  }, [rooms]);
  return (
    <>
      <div className="chat-list-container flex-column d-flex pr-4">
        <div className="py-2 px-2">
          {/* <input
            type="text"
            placeholder="Search contacts"
            onKeyDown={handleKeyPress}
            onChange={handleChange}
            className="form-control-search chat-input"
            value={searchInput} /> */}
        </div>
        {/* <div className="dropdownn">
          {searchResults.map((country, index) => (
            <div key={index} className="dropdown-content">
              {country.name}
            </div>
          ))}
        </div> */}
        <div className="dropdownn">
          {searchResults.map((user, index) => (
            <button
              key={index}
              className="dropdown-content btn btn-light"
              onClick={() => handleUserSelect(user.email + "-" + user.userId)}
            >
              {user.email + "-" + user.userId}
            </button>
          ))}
        </div>
        <div className="messages-box flex flex-1">
          <div className="list-group rounded-0">
            {processedRooms.map((room) => (
              <ChatListItem
                key={room.id}
                onClick={() =>
                  dispatch({ type: "set current room", payload: room.id })
                }
                active={currentRoom === room.id}
                room={room}
              />
            ))}
          </div>
        </div>
        <Footer user={user} onLogOut={onLogOut} />
      </div>
    </>
  );
};

export default ChatList;
