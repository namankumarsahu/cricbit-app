import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function MatchList() {
  const [tab, setTab] = useState("live");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  // ✅ CATEGORY LOGIC
  function getCategory(m) {
    const tn = m.tournament?.toLowerCase() || "";

    if (tn.includes("ipl") || tn.includes("league")) return "League";
    if (tn.includes("women")) return "Women";

    if (
      tn.includes("international") ||
      tn.includes("tour") ||
      tn.includes("world") ||
      tn.includes("cup")
    )
      return "International";

    return "Domestic";
  }

  // ✅ FETCH FROM BACKEND
  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/matches/all"
      );

      let data = res.data.matches || [];

      // 🔥 TAB FILTER
      if (tab === "live") {
        data = data.filter((m) => m.status?.toLowerCase() === "live");
      } else if (tab === "recent") {
        data = data.filter((m) => m.status?.toLowerCase() === "completed");
      } else if (tab === "upcoming") {
        data = data.filter((m) => m.status?.toLowerCase() === "upcoming");
      }

      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [tab]);

  const handleAddMatch = () => {
    navigate("/add");
  };

  // ✅ CATEGORY FILTER
  const filteredMatches = matches.filter((m) => {
    if (filter === "All") return true;
    return getCategory(m) === filter;
  });

  const filterTabs = ["All", "International", "League", "Domestic", "Women"];

  return (
    <div className="min-h-screen bg-gray-400 py-6">
      <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

        {/* Logout */}
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
            <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
          </div>
          <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
        </div>

        {/* Tabs */}
        <div className="mb-2 border-b border-gray-300">
          <div className="flex gap-6">
            {["live", "recent", "upcoming"].map((t) => (
              <button
                key={t}
                className={`pb-2 text-sm font-medium ${
                  tab === t
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}

            <button
              className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
              onClick={handleAddMatch}
            >
              Add Match
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                filter === cat
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-3/4">

            {loading ? (
              <div className="text-gray-500 py-6 text-center text-sm">
                Loading matches...
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-gray-400 py-6 text-center text-sm">
                No matches available
              </div>
            ) : (
              <div className="space-y-4">

                {filteredMatches.map((m, idx) => (
                  <div
                    key={m.externalId || idx}
                    className="border rounded-md p-4 bg-gray-50"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between mb-1">
                      <div className="font-semibold text-sm">
                        {m.team1?.name} vs {m.team2?.name}
                      </div>

                      <div className="text-xs text-green-700 font-bold">
                        {getCategory(m)}
                      </div>
                    </div>

                    {/* 🔥 SCORE */}
                    <div className="text-sm mt-1">
                      <div>
                        <b>{m.team1?.name}:</b>{" "}
                        {m.team1?.score}/{m.team1?.wickets} ({m.team1?.overs})
                      </div>

                      <div>
                        <b>{m.team2?.name}:</b>{" "}
                        {m.team2?.score}/{m.team2?.wickets} ({m.team2?.overs})
                      </div>
                    </div>

                    {/* 🔥 RESULT */}
                    {m.status === "Completed" && (
                      <div className="text-green-600 font-semibold mt-1">
                        {Number(m.team1?.score) > Number(m.team2?.score)
                          ? `${m.team1?.name} Won`
                          : `${m.team2?.name} Won`}
                      </div>
                    )}

                    {/* FOOTER */}
                    <div className="text-xs text-gray-600 mt-1">
                      {m.status} • {m.venue}
                    </div>

                    {/* LIVE BADGE */}
                    {m.isLive && (
                      <div className="text-green-600 font-bold mt-1">
                        LIVE
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   // ✅ CATEGORY LOGIC
//   function getCategory(m) {
//     const tn = m.tournament?.toLowerCase() || "";

//     if (tn.includes("ipl") || tn.includes("league")) return "League";
//     if (tn.includes("women")) return "Women";

//     if (
//       tn.includes("international") ||
//       tn.includes("tour") ||
//       tn.includes("world") ||
//       tn.includes("cup")
//     )
//       return "International";

//     return "Domestic";
//   }

//   // ✅ FINAL FETCH (FROM DB ONLY)
//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/matches/all"
//       );

//       console.log("API DATA:", res.data);

//       let data = res.data.matches || [];

//       // 🔥 FILTER BY TAB
//       if (tab === "live") {
//       data = data.filter((m) => m.status?.toLowerCase() === "live");
//       } else if (tab === "recent") {
//       data = data.filter((m) => m.status?.toLowerCase() === "completed");
//       } else if (tab === "upcoming") {
//       data = data.filter((m) => m.status?.toLowerCase() === "upcoming");
//       }

//       setMatches(data);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches();
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   // ✅ CATEGORY FILTER
//   const filteredMatches = matches.filter((m) => {
//     if (filter === "All") return true;
//     return getCategory(m) === filter;
//   });

//   const filterTabs = ["All", "International", "League", "Domestic", "Women"];

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         {/* Header */}
//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-2 border-b border-gray-300">
//           <div className="flex gap-6">
//             {["live", "recent", "upcoming"].map((t) => (
//               <button
//                 key={t}
//                 className={`pb-2 text-sm font-medium ${
//                   tab === t
//                     ? "text-green-600 border-b-2 border-green-600"
//                     : "text-gray-600 hover:text-black"
//                 }`}
//                 onClick={() => setTab(t)}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             ))}

//             <button
//               className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-4">
//           {filterTabs.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                 filter === cat
//                   ? "border-green-600 bg-green-50 text-green-700"
//                   : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
//               }`}
//               onClick={() => setFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex justify-center">
//           <div className="w-3/4">

//             {loading ? (
//               <div className="text-gray-500 py-6 text-center text-sm">
//                 Loading matches...
//               </div>
//             ) : filteredMatches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center text-sm">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMatches.map((m, idx) => (
//                   <div
//                     key={m.externalId || idx}
//                     className="border rounded-md p-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-1">
//                       <div className="font-semibold text-sm">
//                         {m.team1?.name} vs {m.team2?.name}
//                       </div>

//                       <div className="text-xs text-green-700 font-bold">
//                         {getCategory(m)}
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-600">
//                       {m.status} • {m.venue}
//                     </div>

//                     {m.isLive && (
//                       <div className="text-green-600 font-bold mt-1">
//                         LIVE
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   // 🔥 IMPROVED CATEGORY LOGIC
//   function getCategory(m) {
//     const tn = m.tournament?.toLowerCase() || "";

//     if (tn.includes("ipl") || tn.includes("league")) return "League";
//     if (tn.includes("women")) return "Women";

//     if (
//       tn.includes("international") ||
//       tn.includes("tour") ||
//       tn.includes("world") ||
//       tn.includes("cup")
//     )
//       return "International";

//     return "Domestic";
//   }

//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const url = `http://localhost:5000/api/matches/${tab}`;
//       const res = await axios.get(url);

//       console.log("API DATA:", res.data);

//       setMatches(res.data.matches || []);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches();
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   // ✅ FIXED FILTER (NOW WORKS)
//   const filteredMatches = matches.filter((m) => {
//     if (filter === "All") return true;
//     return getCategory(m) === filter;
//   });

//   const filterTabs = ["All", "International", "League", "Domestic", "Women"];

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         {/* Header */}
//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-2 border-b border-gray-300">
//           <div className="flex gap-6">
//             {["live", "recent", "upcoming"].map((t) => (
//               <button
//                 key={t}
//                 className={`pb-2 text-sm font-medium ${
//                   tab === t
//                     ? "text-green-600 border-b-2 border-green-600"
//                     : "text-gray-600 hover:text-black"
//                 }`}
//                 onClick={() => setTab(t)}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             ))}

//             <button
//               className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-4">
//           {filterTabs.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                 filter === cat
//                   ? "border-green-600 bg-green-50 text-green-700"
//                   : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
//               }`}
//               onClick={() => setFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex justify-center">
//           <div className="w-3/4">

//             {loading ? (
//               <div className="text-gray-500 py-6 text-center text-sm">
//                 Loading matches...
//               </div>
//             ) : filteredMatches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center text-sm">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMatches.map((m, idx) => (
//                   <div
//                     key={m.externalId || idx}
//                     className="border rounded-md p-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-1">
//                       <div className="font-semibold text-sm">
//                         {m.team1?.name} vs {m.team2?.name}
//                       </div>

//                       <div className="text-xs text-green-700 font-bold">
//                         {getCategory(m)}
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-600">
//                       {m.status} • {m.venue}
//                     </div>

//                     {m.isLive && (
//                       <div className="text-green-600 font-bold mt-1">
//                         LIVE
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   // ✅ FIX: derive category properly
//   function getCategory(m) {
//     const tn = m.tournament?.toLowerCase() || "";

//     if (tn.includes("women")) return "Women";
//     if (tn.includes("league")) return "League";
//     if (
//       tn.includes("cup") ||
//       tn.includes("trophy") ||
//       tn.includes("tour")
//     )
//       return "International";

//     return "Domestic";
//   }

//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const url = `http://localhost:5000/api/matches/${tab}`;
//       const res = await axios.get(url);

//       console.log("API:", res.data);

//       setMatches(res.data.matches || []);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches();
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   // ✅ FIXED FILTER
//   // const filteredMatches = matches.filter((m) => {
//   //   if (filter === "All") return true;
//   //   return getCategory(m).toLowerCase() === filter.toLowerCase();
//   // });
// const filteredMatches = matches;


//   const filterTabs = ["All", "International", "League", "Domestic", "Women"];

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         {/* Header */}
//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-2 border-b border-gray-300">
//           <div className="flex gap-6">
//             {["live", "recent", "upcoming"].map((t) => (
//               <button
//                 key={t}
//                 className={`pb-2 text-sm font-medium ${
//                   tab === t
//                     ? "text-green-600 border-b-2 border-green-600"
//                     : "text-gray-600 hover:text-black"
//                 }`}
//                 onClick={() => setTab(t)}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             ))}

//             <button
//               className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-4">
//           {filterTabs.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                 filter === cat
//                   ? "border-green-600 bg-green-50 text-green-700"
//                   : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
//               }`}
//               onClick={() => setFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex justify-center">
//           <div className="w-3/4">

//             {loading ? (
//               <div className="text-gray-500 py-6 text-center text-sm">
//                 Loading matches...
//               </div>
//             ) : filteredMatches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center text-sm">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMatches.map((m, idx) => (
//                   <div
//                     key={m.externalId || idx}
//                     className="border rounded-md p-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-1">
//                       <div className="font-semibold text-sm">
//                         {m.team1?.name} vs {m.team2?.name}
//                       </div>

//                       <div className="text-xs text-green-700 font-bold">
//                         {getCategory(m)}
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-600">
//                       {m.status} • {m.venue}
//                     </div>

//                     {m.isLive && (
//                       <div className="text-green-600 font-bold mt-1">
//                         LIVE
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Fetch matches
//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const url = `http://localhost:5000/api/matches/${tab}`;
//       const res = await axios.get(url);

//       console.log("API RESPONSE:", res.data); // 🔥 DEBUG

//       setMatches(res.data.matches || []);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches();
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-4 border-b border-gray-300">
//           <div className="flex gap-6">
//             {["live", "recent", "upcoming"].map((t) => (
//               <button
//                 key={t}
//                 className={`pb-2 text-sm font-medium ${
//                   tab === t
//                     ? "text-green-600 border-b-2 border-green-600"
//                     : "text-gray-600 hover:text-black"
//                 }`}
//                 onClick={() => setTab(t)}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             ))}

//             <button
//               className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex justify-center">
//           <div className="w-3/4">

//             {loading ? (
//               <div className="text-gray-500 py-6 text-center">
//                 Loading matches...
//               </div>
//             ) : matches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {matches.map((m, idx) => (
//                   <div
//                     key={m.externalId || idx}
//                     className="border rounded-md p-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-1">
//                       <div className="font-semibold">
//                         {m.team1?.name} vs {m.team2?.name}
//                       </div>
//                       {m.isLive && (
//                         <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
//                           LIVE
//                         </span>
//                       )}
//                     </div>

//                     <div className="text-sm">
//                       {m.team1?.score} / {m.team1?.wickets} ({m.team1?.overs})
//                     </div>
//                     <div className="text-sm">
//                       {m.team2?.score} / {m.team2?.wickets} ({m.team2?.overs})
//                     </div>

//                     <div className="text-xs text-gray-600 mt-1">
//                       {m.status} • {m.venue}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const Match = require("../models/Match");

// const RAPID_API_KEY = "YOUR_API_KEY";
// const RAPID_API_HOST = "cricbuzz-cricket.p.rapidapi.com";

// // ✅ Normalize status (VERY IMPORTANT)
// function normalizeStatus(apiStatus) {
//   if (!apiStatus) return "Upcoming";
//   const status = apiStatus.toLowerCase();

//   if (status.includes("live") || status.includes("progress"))
//     return "Live";

//   if (
//     status.includes("won") ||
//     status.includes("complete") ||
//     status.includes("completed") ||
//     status.includes("finished") ||
//     status.includes("result") ||
//     status.includes("draw") ||
//     status.includes("abandoned") ||
//     status.includes("cancelled")
//   )
//     return "Completed";

//   return "Upcoming";
// }

// // ✅ Extract matches from API
// function extractMatches(data) {
//   const matches = [];
//   data?.typeMatches?.forEach((tm) => {
//     tm.seriesMatches?.forEach((sm) => {
//       const series = sm.seriesAdWrapper;
//       if (series?.matches) {
//         series.matches.forEach((m) => {
//           if (m.matchInfo) matches.push(m);
//         });
//       }
//     });
//   });
//   return matches;
// }

// // ✅ Save matches to MongoDB
// async function saveMatches(apiMatches) {
//   for (const m of apiMatches) {
//     const info = m.matchInfo;
//     const score = m.matchScore || {};
//     const statusNormalized = normalizeStatus(
//       info.stateTitle || info.status || ""
//     );

//     await Match.findOneAndUpdate(
//       { externalId: info.matchId?.toString() },
//       {
//         externalId: info.matchId?.toString(),

//         team1: {
//           name: info.team1?.teamName || "-",
//           score: score.team1Score?.inngs1?.runs?.toString() || "-",
//           wickets: score.team1Score?.inngs1?.wickets ?? 0,
//           overs: score.team1Score?.inngs1?.overs?.toString() || "-",
//         },

//         team2: {
//           name: info.team2?.teamName || "-",
//           score: score.team2Score?.inngs1?.runs?.toString() || "-",
//           wickets: score.team2Score?.inngs1?.wickets ?? 0,
//           overs: score.team2Score?.inngs1?.overs?.toString() || "-",
//         },

//         venue: info.venueInfo?.ground || "-",
//         status: statusNormalized,
//         isLive: statusNormalized === "Live",
//         startTime: info.startDate
//           ? new Date(Number(info.startDate))
//           : null,
//         tournament: info.seriesName || "Unknown",
//         lastUpdated: new Date(),
//       },
//       { upsert: true }
//     );
//   }
// }

// // ✅ Fetch and save
// async function fetchAndSaveMatches(endpoint) {
//   const headers = {
//     "x-rapidapi-key": RAPID_API_KEY,
//     "x-rapidapi-host": RAPID_API_HOST,
//   };

//   const res = await axios.get(
//     `https://${RAPID_API_HOST}/matches/v1/${endpoint}`,
//     { headers }
//   );

//   const matches = extractMatches(res.data);
//   await saveMatches(matches);
// }

// // ==============================
// // 🚀 ROUTES
// // ==============================

// // 🔥 LIVE
// router.get("/live", async (req, res) => {
//   try {
//     await fetchAndSaveMatches("live");

//     const matches = await Match.find({ status: "Live" })
//       .sort({ startTime: -1 });

//     res.json({ matches });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get live matches" });
//   }
// });

// // 🔥 RECENT
// router.get("/recent", async (req, res) => {
//   try {
//     await fetchAndSaveMatches("recent");

//     const matches = await Match.find({ status: "Completed" })
//       .sort({ startTime: -1 });

//     res.json({ matches });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get recent matches" });
//   }
// });

// // 🔥 UPCOMING
// router.get("/upcoming", async (req, res) => {
//   try {
//     await fetchAndSaveMatches("upcoming");

//     const matches = await Match.find({ status: "Upcoming" })
//       .sort({ startTime: 1 });

//     res.json({ matches });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get upcoming matches" });
//   }
// });

// // 🔥 ALL (for debugging)
// router.get("/all", async (req, res) => {
//   try {
//     const matches = await Match.find().sort({ startTime: -1 });
//     res.json({ matches });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get matches" });
//   }
// });

// module.exports = router;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   // ✅ FIXED CATEGORY LOGIC (uses DB directly)
//   function getCategory(m) {
//     return m.category || "Domestic";
//   }

//   function parseRuns(scoreStr) {
//     if (!scoreStr || scoreStr === "-") return NaN;
//     const match = scoreStr.match(/^(\d+)/);
//     return match ? parseInt(match[1], 10) : NaN;
//   }

//   function getWinner(m) {
//     if (m.status && m.status.toLowerCase().includes("complete")) {
//       const team1Score = parseRuns(m.team1?.score);
//       const team2Score = parseRuns(m.team2?.score);
//       if (!isNaN(team1Score) && !isNaN(team2Score)) {
//         if (team1Score > team2Score) return m.team1.name;
//         if (team2Score > team1Score) return m.team2.name;
//         return "Draw";
//       }
//     }
//     return null;
//   }

//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const url = `http://localhost:5000/api/matches/${tab}`;
//       const res = await axios.get(url);

//       console.log("API DATA:", res.data); // 🔥 DEBUG

//       setMatches(res.data.matches || []);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tab !== "add") {
//       fetchMatches();
//     }
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   // ✅ FIXED FILTER (case insensitive)
//   const filteredMatches = matches.filter((m) => {
//     if (filter === "All") return true;
//     return (m.category || "").toLowerCase() === filter.toLowerCase();
//   });

//   const filterTabs = ["All", "International", "League", "Domestic", "Women"];

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">

//         {/* Logout */}
//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         {/* Header */}
//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-2 border-b border-gray-300">
//           <div className="flex gap-6">
//             {["live", "recent", "upcoming"].map((t) => (
//               <button
//                 key={t}
//                 className={`pb-2 text-sm font-medium ${
//                   tab === t
//                     ? "text-green-600 border-b-2 border-green-600"
//                     : "text-gray-600 hover:text-black"
//                 }`}
//                 onClick={() => setTab(t)}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             ))}

//             <button
//               className="pb-2 text-sm font-medium text-gray-600 hover:text-black"
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-4">
//           {filterTabs.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                 filter === cat
//                   ? "border-green-600 bg-green-50 text-green-700"
//                   : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
//               }`}
//               onClick={() => setFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex justify-center">
//           <div className="w-3/4">

//             {loading ? (
//               <div className="text-gray-500 py-6 text-center text-sm">
//                 Loading matches...
//               </div>
//             ) : filteredMatches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center text-sm">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMatches.map((m, idx) => {
//                   const winner = getWinner(m);

//                   return (
//                     <div
//                       key={m.externalId || idx}
//                       className="border rounded-md p-4 bg-gray-50"
//                     >
//                       <div className="flex justify-between mb-1">
//                         <div className="font-semibold text-sm">
//                           {m.team1?.name || "Team 1"} vs {m.team2?.name || "Team 2"}
//                         </div>
//                         <div className="text-xs text-green-700 font-bold">
//                           {m.category}
//                         </div>
//                       </div>

//                       <div className="text-xs text-gray-600">
//                         {m.status} • {m.venue || "N/A"}
//                       </div>

//                       {tab === "recent" && winner && (
//                         <div className="text-green-700 font-semibold mt-1">
//                           {winner} Won
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton"; // Import Logout button component

// // Helper to get tournament category for filtering
// function getCategory(m) {
//   const tn = m.tournament?.toLowerCase() || "";
//   if (tn.includes("women")) return "Women";
//   if (tn.includes("league")) return "League";
//   if (tn.includes("cup") || tn.includes("trophy") || tn.includes("tour of")) return "International";
//   return "Domestic"; // fallback category
// }

// export default function MatchList() {
//   const [tab, setTab] = useState("live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   function parseRuns(scoreStr) {
//     if (!scoreStr || scoreStr === "-") return NaN;
//     const match = scoreStr.match(/^(\d+)/);
//     return match ? parseInt(match[1], 10) : NaN;
//   }

//   function getWinner(m) {
//     if (m.status && m.status.toLowerCase().includes("complete")) {
//       const team1Score = parseRuns(m.team1?.score);
//       const team2Score = parseRuns(m.team2?.score);
//       if (!isNaN(team1Score) && !isNaN(team2Score)) {
//         if (team1Score > team2Score) return m.team1.name;
//         if (team2Score > team1Score) return m.team2.name;
//         return "Draw";
//       }
//     }
//     return null;
//   }

//   const fetchMatches = async () => {
//     setLoading(true);
//     try {
//       const url = `http://localhost:5000/api/matches/${tab}`;
//       const res = await axios.get(url);
//       setMatches(res.data.matches || []);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tab !== "add") {
//       fetchMatches();
//     }
//     // eslint-disable-next-line
//   }, [tab]);

//   const handleAddMatch = () => {
//     navigate("/add");
//   };

//   // Filter matches by selected category
//   const filteredMatches = matches.filter((m) => {
//     if (filter === "All") return true;
//     return getCategory(m) === filter;
//   });

//   const filterTabs = ["All", "International", "League", "Domestic", "Women"];

//   return (
//     <div className="min-h-screen bg-gray-400 py-6">
//       <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">
//         {/* Logout button at the top right */}
//         <div className="flex justify-end mb-4">
//           <LogoutButton />
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center mb-3">
//             <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
//             <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">bit</span>
//           </div>
//           <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
//         </div>

//         {/* Main tabs: Live / Recent / Upcoming / Add */}
//         <div className="mb-2 border-b border-gray-300">
//           <div className="flex gap-6">
//             <button
//               className={`pb-2 text-sm font-medium ${
//                 tab === "live" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-black"
//               }`}
//               onClick={() => setTab("live")}
//             >
//               Live
//             </button>
//             <button
//               className={`pb-2 text-sm font-medium ${
//                 tab === "recent" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-black"
//               }`}
//               onClick={() => setTab("recent")}
//             >
//               Recent
//             </button>
//             <button
//               className={`pb-2 text-sm font-medium ${
//                 tab === "upcoming" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-black"
//               }`}
//               onClick={() => setTab("upcoming")}
//             >
//               Upcoming
//             </button>
//             <button
//               className={`pb-2 text-sm font-medium ${
//                 tab === "add" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-black"
//               }`}
//               onClick={handleAddMatch}
//             >
//               Add Match
//             </button>
//           </div>
//         </div>

//         {/* Category filter bar */}
//         <div className="flex gap-3 mb-4">
//           {filterTabs.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                 filter === cat
//                   ? "border-green-600 bg-green-50 text-green-700"
//                   : "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
//               }`}
//               onClick={() => setFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         <div className="flex justify-center">
//           <div className="w-3/4">
//             {tab === "add" ? (
//               <div className="py-6 text-center text-gray-400 text-sm">
//                 Redirecting to Add Match...
//               </div>
//             ) : loading ? (
//               <div className="text-gray-500 py-6 text-center text-sm">
//                 Loading matches...
//               </div>
//             ) : filteredMatches.length === 0 ? (
//               <div className="text-gray-400 py-6 text-center text-sm">
//                 No matches available
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMatches.map((m, idx) => {
//                   const winner = getWinner(m);
//                   return (
//                     <div
//                       key={m.externalId || idx}
//                       className="border rounded-md p-4 bg-gray-50 relative hover:shadow-sm"
//                     >
//                       <div className="flex items-center justify-between mb-0.5">
//                         <div className="font-semibold text-sm">
//                           {m.team1?.name || "Team 1"} vs {m.team2?.name || "Team 2"}
//                         </div>
//                         <div className="flex flex-col items-end">
//                           {m.isLive && (
//                             <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded mb-1">
//                               LIVE
//                             </span>
//                           )}
//                           <span className="text-xs text-green-700 font-bold">{m.tournament}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 items-center mb-0.5">
//                         <div>
//                           <span className="font-bold text-xs">{m.team1?.name || "Team 1"}:</span>{" "}
//                           <span className="font-mono text-xs">
//                             {m.team1?.score !== "-"
//                               ? `${m.team1.score}/${m.team1.wickets} (${m.team1.overs})`
//                               : "Yet to bat"}
//                           </span>
//                         </div>
//                         <div>
//                           <span className="font-bold text-xs">{m.team2?.name || "Team 2"}:</span>{" "}
//                           <span className="font-mono text-xs">
//                             {m.team2?.score !== "-"
//                               ? `${m.team2.score}/${m.team2.wickets} (${m.team2.overs})`
//                               : "Yet to bat"}
//                           </span>
//                         </div>
//                       </div>
//                       {tab === "recent" && (
//                         <div className="text-green-700 font-semibold mb-1">
//                           {winner ? `${winner} Won` : m.status}
//                         </div>
//                       )}
//                       <div className="text-xs text-gray-600">
//                         <span>{m.status}</span>
//                         <span>
//                           {" "}
//                           &middot;{" "}
//                           {m.startTime
//                             ? new Date(m.startTime).toLocaleString(undefined, {
//                                 day: "2-digit",
//                                 month: "short",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })
//                             : "N/A"}
//                         </span>
//                         <span> &middot; {m.venue}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



/* import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MatchList() {
  const [tab, setTab] = useState("live");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/matches/${tab}`;
      const res = await axios.get(url);
      setMatches(res.data.matches || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "add") {
      fetchMatches();
    }
    // eslint-disable-next-line
  }, [tab]);

  const handleAddMatch = () => {
    navigate("/add");
  };

  return (
    <div className="min-h-screen bg-gray-400 py-6">
      <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow">
     
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <span className="font-bold text-2xl text-green-700 mr-1">cric</span>
            <span className="font-bold text-2xl text-white px-2 bg-green-700 rounded">
              bit
            </span>
          </div>
          <div className="font-bold mb-4 text-lg">Live Cricket Score</div>
        </div>

      
        <div className="mb-4 border-b border-gray-300">
          <div className="flex gap-6">
            <button
              className={`pb-2 text-sm font-medium ${
                tab === "live"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setTab("live")}
            >
              Live
            </button>
            <button
              className={`pb-2 text-sm font-medium ${
                tab === "recent"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setTab("recent")}
            >
              Recent
            </button>
            <button
              className={`pb-2 text-sm font-medium ${
                tab === "upcoming"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`pb-2 text-sm font-medium ${
                tab === "add"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={handleAddMatch}
            >
              Add Match
            </button>
          </div>
        </div>

      
        <div className="flex justify-center">
          <div className="w-3/4">
            {tab === "add" ? (
              <div className="py-6 text-center text-gray-400 text-sm">
                Redirecting to Add Match...
              </div>
            ) : loading ? (
              <div className="text-gray-500 py-6 text-center text-sm">
                Loading matches...
              </div>
            ) : matches.length === 0 ? (
              <div className="text-gray-400 py-6 text-center text-sm">
                No matches available
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m, idx) => (
                  <div
                    key={m.externalId || idx}
                    className="border rounded-md p-4 bg-gray-50 relative hover:shadow-sm"
                  >
                   
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="font-semibold text-sm">
                        {m.team1?.name || "Team 1"} vs{" "}
                        {m.team2?.name || "Team 2"}
                      </div>
                      <div className="flex flex-col items-end">
                        {m.isLive && (
                          <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded mb-1">
                            LIVE
                          </span>
                        )}
                        <span className="text-xs text-green-700 font-bold">
                          {m.tournament}
                        </span>
                      </div>
                    </div>
                   
                    <div className="flex gap-2 items-center mb-0.5">
                      <div>
                        <span className="font-bold text-xs">
                          {m.team1?.name || "Team 1"}:
                        </span>{" "}
                        <span className="font-mono text-xs">
                          {m.team1?.score !== "-"
                            ? `${m.team1.score}/${m.team1.wickets} (${m.team1.overs})`
                            : "Yet to bat"}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-xs">
                          {m.team2?.name || "Team 2"}:
                        </span>{" "}
                        <span className="font-mono text-xs">
                          {m.team2?.score !== "-"
                            ? `${m.team2.score}/${m.team2.wickets} (${m.team2.overs})`
                            : "Yet to bat"}
                        </span>
                      </div>
                    </div>
               
                    <div className="text-xs text-gray-600">
                      <span>{m.status}</span>
                      <span>
                        {" "}
                        &middot;{" "}
                        {m.startTime
                          ? new Date(m.startTime).toLocaleString(undefined, {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                      <span> &middot; {m.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 */