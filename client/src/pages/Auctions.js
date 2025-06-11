// ======= Frontend: Auctions.js =======
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidInputs, setBidInputs] = useState({});
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    console.log('Socket.IO connected');

    const fetchAuctions = async () => {
      let timeoutId;
      try {
        const source = axios.CancelToken.source();
        timeoutId = setTimeout(() => {
          source.cancel('Request timed out');
        }, 2000);

        const response = await axios.get('http://localhost:5000/api/auctions', {
          cancelToken: source.token,
        });
        setAuctions(response.data);
        setFilteredAuctions(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          setError('Auction fetch timed out');
        } else {
          setError('Failed to fetch auctions');
        }
        console.error(error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    fetchAuctions();

    socketRef.current.on('newAuction', (newAuction) => {
      setAuctions((prev) => [...prev, newAuction]);
    });

    socketRef.current.on('bidUpdate', (updatedAuction) => {
      setAuctions((prev) =>
        prev.map((a) => (a._id === updatedAuction._id ? updatedAuction : a))
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = auctions.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAuctions(filtered);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, auctions]);

  const handleBid = async (auctionId) => {
    const bidAmount = bidInputs[auctionId];
    if (!bidAmount) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/auctions/${auctionId}/bid`,
        { bidAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      setBidInputs((prev) => ({ ...prev, [auctionId]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place bid');
    }
  };

  if (loading) return <div>Loading auctions...</div>;

  return (
    
    
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-md">
  <h2 className="text-2xl font-bold text-center mb-6">Auctions</h2>

  {error && <p className="text-red-500 text-center mb-4">{error}</p>}

  {user && (
    <div className="text-center mb-6">
      <Link to="/create-auction">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Create New Auction
        </button>
      </Link>
    </div>
  )}

  <div className="mb-6 text-center">
    <input
      type="text"
      placeholder="Search auctions..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {filteredAuctions.length === 0 ? (
    <p className="text-center">No auctions found.</p>
  ) : (
    filteredAuctions.map((auction) => (
      <div
        key={auction._id}
        className="border border-gray-300 rounded-md p-6 mb-6 shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
        <p className="mb-2">{auction.description}</p>
        <p className="mb-1"><strong>Starting Bid:</strong> ${auction.startingBid}</p>
        <p className="mb-1"><strong>Current Bid:</strong> ${auction.currentBid}</p>
        <p className="mb-4"><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>

        {user && (
          <div className="mb-4">
            <input
              type="number"
              placeholder="Enter bid amount"
              value={bidInputs[auction._id] || ''}
              onChange={(e) =>
                setBidInputs({ ...bidInputs, [auction._id]: e.target.value })
              }
              className="px-3 py-1 border border-gray-300 rounded-md mr-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleBid(auction._id)}
              className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Place Bid
            </button>
          </div>
        )}

        <Link to={`/auctions/${auction._id}`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            View Auction
          </button>
        </Link>
      </div>
    ))
  )}
</div>

  );
};

export default Auctions;






































// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const Auctions = () => {
//   const [auctions, setAuctions] = useState([]);
//   const [filteredAuctions, setFilteredAuctions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');
//     console.log('Socket.IO connected');

//     const fetchAuctions = async () => {
//       let timeoutId; // Declare timeoutId to store the setTimeout ID
//       try {
//         const source = axios.CancelToken.source();
//         timeoutId = setTimeout(() => {
//           source.cancel('Request timed out');
//         }, 2000); // 2-second timeout

//         const response = await axios.get('http://localhost:5000/api/auctions', {
//           cancelToken: source.token,
//         });
//         console.log('Fetched auctions on frontend:', response.data);
//         setAuctions(response.data);
//         setFilteredAuctions(response.data);
//       } catch (error) {
//         if (axios.isCancel(error)) {
//           setError('Auction fetch timed out');
//         } else {
//           setError('Failed to fetch auctions');
//         }
//         console.error(error);
//       } finally {
//         clearTimeout(timeoutId); // Use timeoutId instead of timeout
//         setLoading(false);
//       }
//     };
//     fetchAuctions();

//     socketRef.current.on('newAuction', (newAuction) => {
//       console.log('New auction received:', newAuction);
//       setAuctions((prevAuctions) => [...prevAuctions, newAuction]);
//     });

//     socketRef.current.on('bidUpdate', (updatedAuction) => {
//       console.log('Bid update received:', updatedAuction);
//       setAuctions((prevAuctions) =>
//         prevAuctions.map((auction) =>
//           auction._id === updatedAuction._id ? updatedAuction : auction
//         )
//       );
//     });

//     return () => {
//       socketRef.current.disconnect();
//       console.log('Socket.IO disconnected');
//     };
//   }, []);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       console.log('Filtering auctions with searchTerm:', searchTerm);
//       const filtered = auctions.filter(
//         (auction) =>
//           auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           auction.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredAuctions(filtered);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [searchTerm, auctions]);

//   if (loading) {
//     return <div>Loading auctions...</div>;
//   }

//   return (
//     <div
//       style={{
//         padding: '30px',
//         maxWidth: '900px',
//         margin: '0 auto',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '30px' }}>
//         Auctions
//       </h2>

//       {error && (
//         <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>
//       )}

//       {user && (
//         <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//           <Link to="/create-auction">
//             <button
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#007bff',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//               }}
//             >
//               Create New Auction
//             </button>
//           </Link>
//         </div>
//       )}

//       <div style={{ marginBottom: '30px', textAlign: 'center' }}>
//         <input
//           type="text"
//           placeholder="Search auctions by title or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: '10px',
//             width: '100%',
//             maxWidth: '500px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//           }}
//         />
//       </div>

//       <div>
//         {filteredAuctions.length === 0 ? (
//           <p style={{ textAlign: 'center', color: '#666' }}>No auctions found.</p>
//         ) : (
//           filteredAuctions.map((auction) => {
//             try {
//               return (
//                 <div
//                   key={auction._id}
//                   style={{
//                     border: '1px solid #ddd',
//                     borderRadius: '10px',
//                     padding: '20px',
//                     marginBottom: '20px',
//                     backgroundColor: '#fdfdfd',
//                     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
//                   }}
//                 >
//                   <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
//                     {auction.title}
//                   </h3>
//                   <p style={{ marginBottom: '8px', color: '#333' }}>
//                     {auction.description}
//                   </p>
//                   <p style={{ marginBottom: '5px' }}>
//                     <strong>Starting Bid:</strong> ${auction.startingBid}
//                   </p>
//                   <p style={{ marginBottom: '5px' }}>
//                     <strong>Current Bid:</strong> ${auction.currentBid}
//                   </p>
//                   <p style={{ marginBottom: '15px', color: '#666' }}>
//                     <strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}
//                   </p>
//                   <Link to={`/auctions/${auction._id}`}>
//                     <button
//                       style={{
//                         padding: '8px 16px',
//                         backgroundColor: '#28a745',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       View Auction
//                     </button>
//                   </Link>
//                 </div>
//               );
//             } catch (error) {
//               console.error('Error rendering auction:', auction, error);
//               return null;
//             }
//           })
//         )}
//       </div>
//     </div>

//   );
// };

// export default Auctions;