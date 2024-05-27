import React, { useState, useEffect, useContext } from "react";
import WhiteBoard1 from "./WhiteBoard1";
import { SocketContext } from "./Socket";
import { AuthContext } from "../components/AuthContext";
import Login from "../components/Login";
import Register from "../components/Register";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const { user, loading } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("error", (errorMessage) => {
      setError(errorMessage);
    });

    return () => {
      socket.off("error");
    };
  }, [socket]);

  const handleCreateOrJoin = () => {
    if (!roomId) {
      setError("Room ID cannot be empty");
      return;
    }
    socket.emit("joinRoom", { username: "User", room: roomId });
    setJoined(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <Login />
        <h2>Register</h2>
        <Register />
      </div>
    );
  } else if (!joined) {
    return (
      <>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleCreateOrJoin}>Create/Join Room</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </>
    );
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <WhiteBoard1 socket={socket} roomId={roomId} />
    </div>
  );
};

export default Home;

// const Home = () => {
//   const [roomId, setRoomId] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [error, setError] = useState(null);

//   const socket = useContext(SocketContext);

//   useEffect(() => {
//     socket.on("error", (errorMessage) => {
//       setError(errorMessage);
//     });

//     return () => {
//       socket.off("error");
//     };
//   }, [socket]);

//   const handleCreateOrJoin = () => {
//     if (!roomId) {
//       setError("Room ID cannot be empty");
//       return;
//     }
//     socket.emit("joinRoom", { username: "User", room: roomId });
//     setJoined(true);
//   };

//   return (
//     <div>
//       {!joined ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <button onClick={handleCreateOrJoin}>Create/Join Room</button>
//         </div>
//       ) : (
//         <WhiteBoard1 socket={socket} roomId={roomId} />
//       )}
//       {error && <div style={{ color: "red" }}>{error}</div>}
//     </div>
//   );
// };

// export default Home;
