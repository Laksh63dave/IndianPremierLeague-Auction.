"use client";
import { useState, useEffect, useMemo } from "react";
// Added missing icons to the import list
import { Zap, Trophy, ClipboardList, LayoutGrid, ChevronLeft, Users, Search, Star, ShieldCheck, Banknote, Target, Laptop, Briefcase, Boxes, MessageSquare } from "lucide-react";
import playersData from "@/players";
import { shuffleArray } from "@/shuffle";

const fontStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
  WebkitFontSmoothing: 'antialiased',
  letterSpacing: '-0.02em'
};

const teamLogos: Record<string, string> = {
  "Mumbai Indians": "/logos/mi.png",
  "Chennai Super Kings": "/logos/csk.png",
  "Royal Challengers Bangalore": "/logos/rcb.png",
  "Kolkata Knight Riders": "/logos/kkr.png",
  "Delhi Capitals": "/logos/dc.png",
  "Punjab Kings": "/logos/pbks.png",
  "Rajasthan Royals": "/logos/rr.png",
  "Sunrisers Hyderabad": "/logos/srh.png",
  "Gujarat Titans": "/logos/gt.png",
  "Lucknow Super Giants": "/logos/lsg.png",
};

const teamColors: any = {
  "Mumbai Indians": '#004BA0',
  "Chennai Super Kings": '#ffd000',
  "Royal Challengers Bangalore": '#ff0000',
  "Kolkata Knight Riders": "#2e1652",
  "Delhi Capitals": '#05a3ff',
  "Punjab Kings": "#ed1b1b",
  "Rajasthan Royals": '#dd0c83',
  "Sunrisers Hyderabad": "#eb5d1b",
  "Gujarat Titans": '#0c2140',
  "Lucknow Super Giants": "#cb165e",
};

// Custom Franchise Mottos for UI depth
const teamMottos: Record<string, string> = {
  "MI": "#Duniya Hila Denge",
  "CSK": "#Whistle Podu",
  "RCB": "#Ee Sala Cup Namde",
  "KKR": "#Korbo Lorbo Jeetbo",
  "RR": "#Halla Bol",
  "SRH": "#Orange Army",
  "DC": "#Roar Macha",
  "PBKS": "#Bas Jeetna Hai",
  "GT": "#Aava De",
  "LSG": "#Gazab Andaz",
};

export default function Home() {
  const teamsUI = [
    { code: 'MI', name: 'Mumbai Indians', color: '#004BA0', bg: '#004BA0' },
    { code: 'RR', name: 'Rajasthan Royals', color: '#dd0c83', bg: '#dd0c83' },
    { code: 'RCB', name: 'Royal Challengers Bangalore', color: '#ff0000', bg: '#ff0000' },
    { code: 'GT', name: 'Gujarat Titans', color: '#0c2140', bg: '#0c2140' },
    { code: 'DC', name: 'Delhi Capitals', color: '#05a3ff', bg: '#05a3ff' },
    { code: 'PBKS', name: 'Punjab Kings', color: '#ed1b1b', bg: '#ed1b1b' },
    { code: 'CSK', name: 'Chennai Super Kings', color: '#ffd000', bg: '#ffd000' },
    { code: 'SRH', name: 'Sunrisers Hyderabad', color: '#eb5d1b', bg: '#eb5d1b' },
    { code: 'KKR', name: 'Kolkata Knight Riders', color: '#2e1652', bg: '#2e1652' },
    { code: 'LSG', name: 'Lucknow Super Giants', color: '#cb165e', bg: '#cb165e' },
  ];

  const iplTeams = teamsUI.map(t => t.name);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamUI, setSelectedTeamUI] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [hoveredTeamUI, setHoveredTeamUI] = useState<string | null>(null);

  const [showBriefing, setShowBriefing] = useState(false);
  // FIXED: Added missing state variable
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNum, setCountdownNum] = useState(3);
  const [auctionStarted, setAuctionStarted] = useState(false);
  
  // --- UPDATED: SORTING BY ROLE SLOTS ---
  const [players] = useState(() => {
    const roleOrder = ["Batsman", "Wicketkeeper", "All-rounder", "Bowler"];
    return roleOrder.flatMap(role => 
      shuffleArray(playersData.filter(p => p.role === role))
    );
  });

  const [index, setIndex] = useState(0);
  const [bid, setBid] = useState(players[0]?.base || 2);
  const [timer, setTimer] = useState(10);
  const [sold, setSold] = useState(false);
  const [soldPlayer, setSoldPlayer] = useState<any>(null);
  const [unsoldPlayers, setUnsoldPlayers] = useState<any[]>([]);
  const [hasBid, setHasBid] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [currentBidder, setCurrentBidder] = useState<string | null>(null);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<any | null>(null);
  const [showReq, setShowReq] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [showMultiplayerAlert, setShowMultiplayerAlert] = useState(false);
  
  const [showSetIntro, setShowSetIntro] = useState(false);
  const [currentSet, setCurrentSet] = useState(players[0]?.role || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [showUnsoldModal, setShowUnsoldModal] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const canAddPlayer = (team: any, player: any) => {
    if (team.squad.length >= 15) return false;
    const overseasCount = team.squad.filter((p: any) => p.overseas).length;
    if (player.overseas && overseasCount >= 4) return false;
    return true;
  };

  const getRoleCounts = (squad: any[]) => {
    return {
      Batsman: squad.filter(p => p.role === "Batsman").length,
      Bowler: squad.filter(p => p.role === "Bowler").length,
      "All-rounder": squad.filter(p => p.role === "All-rounder").length,
      Wicketkeeper: squad.filter(p => p.role === "Wicketkeeper").length,
    };
  };

  const filteredPool = useMemo(() => {
    const filtered = playersData.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      Batsmen: filtered.filter(p => p.role === "Batsman"),
      Wicketkeepers: filtered.filter(p => p.role === "Wicketkeeper"),
      AllRounders: filtered.filter(p => p.role === "All-rounder"),
      Bowlers: filtered.filter(p => p.role === "Bowler"),
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedTeam) return;
    const initTeams = iplTeams.map((t) => ({
      name: t,
      purse: 120,
      squad: [],
      isUser: t === selectedTeam,
    }));
    setTeams(initTeams);
  }, [selectedTeam]);

  // FIXED: Gated timer logic by auctionStarted
  useEffect(() => {
    if (!auctionStarted || auctionEnded || showSetIntro) return;
    if (timer === 0) {
      sellPlayer();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, auctionStarted, auctionEnded, showSetIntro]);

  // --- REWRITTEN AI LOGIC EMBEDDING ALL 6 IPL STRATEGIES ---
  useEffect(() => {
    if (!auctionStarted || teams.length === 0 || auctionEnded || showSetIntro) return;
    const player = players[index];
    if (!player) return;
    const aiTeams = teams.filter((t) => !t.isUser);
    const ai = aiTeams[Math.floor(Math.random() * aiTeams.length)];
    if (!canAddPlayer(ai, player)) return;
    
    if (currentBidder === ai.name) return;

    let increment = 0.25;
    if (bid >= 10 && bid < 20) increment = 0.5;
    else if (bid >= 20) increment = 1;

    if (ai.purse < increment) return;

    // 3. Price Elasticity Based on Base Price
    let maxLimit = player.base * 2; 
    if (player.rating >= 95) {
      maxLimit = player.base >= 10 ? 24 + Math.random() * 5 : 14 + Math.random() * 3; 
    } else if (player.rating >= 92) {
      maxLimit = player.base >= 8 ? 16 + Math.random() * 4 : 11 + Math.random() * 2; 
    } else if (player.rating >= 88) {
      maxLimit = 9 + Math.random() * 2; 
    } else if (player.rating >= 85) {
      maxLimit = 7 + Math.random() * 2; 
    } else {
      maxLimit = player.base * 3.5; 
    }

    let chance = 0.25;
    if (player.base === 2) chance += 0.2;
    else if (player.base === 1) chance += 0.1;
    
    const count = ai.squad.filter((p: any) => p.role === player.role).length;
    const totalSquadCount = ai.squad.length;
    const neededPlayers = 15 - totalSquadCount;

    // 1. Purse-to-Slot Panic Logic (Future Budgeting)
    if (neededPlayers > 0) {
      const averageBudgetPerSlot = ai.purse / neededPlayers;
      if (averageBudgetPerSlot < 3.5 && player.rating >= 90) {
        maxLimit = Math.min(maxLimit, ai.purse * 0.4);
      }
    }
    if (ai.purse < 30 && player.rating >= 93) {
      maxLimit = Math.min(maxLimit, 9.5);
    }

    // 2. Position Quota & Diminishing Utility
    const worldClassInRole = ai.squad.filter((p: any) => p.role === player.role && p.rating >= 94).length;
    if (worldClassInRole >= 2 && player.rating >= 94) {
      maxLimit *= 0.5;
      chance -= 0.2;
    }

    if (
      (player.role === "Batsman" && count < 5) ||
      (player.role === "Bowler" && count < 4) ||
      (player.role === "All-rounder" && count < 4) ||
      (player.role === "Wicketkeeper" && count < 2)
    ) {
      chance += 0.35;
      maxLimit += 1.5;
    }
    
    // 4. The "Set Inflation" Fatigue
    const highSpentPlayersInRoom = teams.flatMap(t => t.squad).filter((p: any) => p.price >= 18).length;
    if (highSpentPlayersInRoom >= 3 && index < players.length * 0.4) {
      maxLimit *= 0.75;
      chance -= 0.15;
    }

    // 5. Squad Deficit Panic Mode (Emergency Bidding)
    const totalAuctionProgress = index / players.length;
    let isPanicMode = false;
    if (totalAuctionProgress >= 0.65) {
      const isShortOnRole = 
        (player.role === "Batsman" && count < 5) ||
        (player.role === "Bowler" && count < 4) ||
        (player.role === "All-rounder" && count < 4) ||
        (player.role === "Wicketkeeper" && count < 2);

      if (isShortOnRole) {
        isPanicMode = true;
        chance += 0.5;
        maxLimit = Math.min(ai.purse - (neededPlayers * 0.5), maxLimit + 5);
      }
    }

    // 6. The "Rival Purse" Bullying (Aukaat Over-ride)
    const sortedPurses = [...teams].sort((a, b) => b.purse - a.purse);
    const top3Teams = sortedPurses.slice(0, 3).map(t => t.name);
    const isAmirAI = top3Teams.includes(ai.name);
    const isRoomGareeb = sortedPurses.filter(t => t.name !== ai.name)[0]?.purse < 35;

    if (isAmirAI && isRoomGareeb && ai.purse > 65 && !isPanicMode) {
      maxLimit += 3.5;
      chance += 0.2;
    }
    
    if (bid >= maxLimit) return;
    if (Math.random() < 0.2) return;
    
    const delay = timer <= 3 ? Math.random() * 400 : 700 + Math.random() * 800;
    const timeout = setTimeout(() => {
      const willBid = Math.random() < chance;
      if (willBid && ai.purse >= increment) {
        setBid((prev: number) => +(prev + increment).toFixed(2));
        setCurrentBidder(ai.name);
        setTimer(10);
        setHasBid(true);
      }
    }, delay);
    return () => { if (timeout) clearTimeout(timeout); };
  }, [bid, index, timer, currentBidder, showSetIntro, auctionStarted, teams]);

  const increaseBid = () => {
    const user = teams.find((t) => t.isUser);
    if (!user || showSetIntro) return;
    if (currentBidder === user.name) return;

    const currentPlayer = players[index];
    if (!canAddPlayer(user, currentPlayer)) {
      alert("aur kitne players lega dalle !!");
      return;
    }

    let increment = 0.25;
    if (bid >= 10 && bid < 20) increment = 0.5;
    else if (bid >= 20) increment = 1;

    if (user.purse < increment) {
      alert("paise nahi hai dalle 💸");
      return;
    }

    setBid((prev: number) => +(prev + increment).toFixed(2));
    setCurrentBidder(user.name);
    setTimer(10);
    setHasBid(true);
  };

  const sellPlayer = () => {
    const current = players[index];
    if (!current) return;
    setSold(true);
    if (hasBid && currentBidder) {
      setSoldPlayer({ ...current, price: bid });
      setTeams((prev) =>
        prev.map((t) => {
          if (t.name === currentBidder) {
            return { ...t, purse: +(t.purse - bid).toFixed(2), squad: [...t.squad, { ...current, price: bid }] };
          }
          return t;
        })
      );
    } else {
      setSoldPlayer({ ...current, price: "UNSOLD" });
      setUnsoldPlayers((prev) => [...prev, current]);
    }

    window.setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= players.length) {
        setAuctionEnded(true);
        setSold(false);
        return;
      }

      const nextPlayer = players[nextIndex];
      const prevPlayer = players[index];
      
      if (nextPlayer.role !== prevPlayer.role) {
        setCurrentSet(nextPlayer.role);
        setShowSetIntro(true);
        setSold(false);
        setSoldPlayer(null);
        
        setTimeout(() => {
          setShowSetIntro(false);
          updatePlayerState(nextIndex);
        }, 3500);
      } else {
        updatePlayerState(nextIndex);
      }
    }, 2000);
    
    const updatePlayerState = (nextIndex: number) => {
      setIndex(nextIndex);
      setBid(players[nextIndex]?.base || 2);
      setSold(false);
      setSoldPlayer(null);
      setTimer(10);
      setHasBid(false);
      setCurrentBidder(null);
    };
  };

  const startBriefingFlow = () => {
    const team = teamsUI.find(t => t.code === selectedTeamUI);
    if (team) {
      setSelectedTeam(team.name);
      setShowBriefing(true);
    }
  };

  const commenceAuction = () => {
    setShowBriefing(false);
    setIsCountingDown(true);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setIsCountingDown(false);
        setAuctionStarted(true);
      } else {
        setCountdownNum(count);
      }
    }, 1000);
  };

  const userTeam = teams.find((t) => t.isUser);
  const player = players[index];
  const userCounts = userTeam ? getRoleCounts(userTeam.squad) : { Batsman: 0, Bowler: 0, "All-rounder": 0, Wicketkeeper: 0 };
  const isSquadValid = userCounts.Batsman >= 5 && userCounts.Bowler >= 4 && userCounts["All-rounder"] >= 4 && userCounts.Wicketkeeper >= 2;
  const isFormValid = playerName.trim() !== "" && selectedTeamUI !== "";

  const isFavoriteActive = player && favorites.includes(player.name);

  // Dynamic context wire ups for theme shifts
  const selectedTeamData = teamsUI.find((t) => t.code === selectedTeamUI);
  const activeColor = selectedTeamData ? selectedTeamData.color : '#ea580c'; // Fallback to orange-500

  // --- REPLACED & UPGRADED: SCREEN 1 TEAM SELECT ---
  if (!selectedTeam) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center p-5 relative overflow-hidden" style={fontStyle}>
        
        {/* Dynamic Theme Glow Engine */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700" 
          style={{ backgroundColor: hoveredTeamUI ? teamColors[teamsUI.find(t=>t.code===hoveredTeamUI)?.name || ''] : activeColor }}
        />

        <div className="relative z-10 w-full max-w-xl">
 
          {/* Header */}
          <div className="mb-10 text-left">
            <p 
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] mb-3 transition-colors duration-500"
              style={{ color: activeColor }}
            >
              <span className="inline-block w-5 h-px rounded transition-colors duration-500" style={{ backgroundColor: activeColor }} />
              IPL Auction 2026
            </p>
            <h1 className="text-[38px] font-semibold text-[#f5f5f7] leading-[1.05] tracking-[-0.04em] mb-2">
              Pick your franchise.
            </h1>
            <p className="text-[15px] text-[#86868b] font-normal">Build your dream squad. Rule the auction.</p>
          </div>
 
          {/* Name input with Signature Overlay Indicator */}
          <div className="mb-8 text-left relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-[0.04em]">
                Your name
              </label>
              {playerName.trim() !== "" && (
                <span className="text-[9px] font-black text-gray-600 tracking-widest uppercase animate-fadeIn">
                  Welcome Captain.
                </span>
              )}
            </div>
            <input
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-[20px] rounded-2xl px-5 py-4 text-[15px] text-[#f5f5f7] placeholder-[#3d3d40] outline-none transition-all"
              style={{ ...fontStyle, borderColor: playerName.trim() !== "" ? `${activeColor}44` : "" }}
            />
          </div>
 
          {/* Team grid with Logo Hover Triggers */}
          <div className="mb-6 text-left">
            <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-4">
              Choose your team
            </label>
            <div className="grid grid-cols-5 gap-3">
              {teamsUI.map((team) => {
                const active = selectedTeamUI === team.code;
                const isHovered = hoveredTeamUI === team.code;
                return (
                  <button
                    key={team.code}
                    onClick={() => setSelectedTeamUI(team.code)}
                    onMouseEnter={() => setHoveredTeamUI(team.code)}
                    onMouseLeave={() => setHoveredTeamUI(null)}
                    className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                      active
                        ? "border"
                        : "border border-white/[0.08] hover:border-white/[0.14]"
                    }`}
                    style={{
                      borderColor: active ? activeColor : "",
                      background: active ? `${activeColor}11` : "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(05px)",
                      transform: active ? "translateY(-4px)" : isHovered ? "translateY(-2px)" : undefined,
                    }}
                  >
                    {/* Translucent Logo Watermark Hover Effect */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 ${isHovered || active ? "opacity-[0.08]" : ""}`}
                    >
                      <img src={teamLogos[team.name]} className="w-16 h-16 object-contain scale-125" alt="watermark" />
                    </div>

                    {/* Dynamic top line when selected */}
                    {active && (
                      <span className="absolute top-0 left-1/4 right-1/4 h-px rounded-full"
                        style={{ background: `linear-gradient(90deg,transparent, ${activeColor} ,transparent)` }} />
                    )}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 border border-white/5 shadow-md"
                      style={{ 
                        background: team.bg, 
                        color: '#fff', 
                        transform: active ? "scale(1.1)" : undefined,
                        boxShadow: active ? `0 0 15px ${activeColor}66` : ""
                      }}
                    >
                      {team.code}
                    </div>
                    <span 
                      className={`text-[10px] font-medium tracking-[0.02em] transition-colors duration-300 ${active ? "font-bold" : "text-[#86868b]"}`}
                      style={{ color: active ? activeColor : "" }}
                    >
                      {team.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Selected team banner with Franchise Mottos */}
          <div 
            className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-[20px] rounded-2xl flex items-center justify-between px-5 py-4 mb-6 transition-all duration-500 text-left"
            style={{ borderColor: selectedTeamData ? `${activeColor}33` : "" }}
          >
            {selectedTeamData ? (
              <>
                <div className="flex items-center gap-4 animate-fadeIn">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shadow-md border border-white/5 transition-transform duration-500"
                    style={{ background: selectedTeamData.bg, boxShadow: `0 0 15px ${activeColor}44` }}
                  >
                    {selectedTeamData.code}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#f5f5f7]">{selectedTeamData.name}</p>
                    {/* Dynamic Franchise Historical Motto Insertion */}
                    <p className="text-[11px] text-[#86868b] mt-0.5 font-medium transition-colors" style={{ color: `${activeColor}cc` }}>
                      {teamMottos[selectedTeamData.code]}
                    </p>
                  </div>
                </div>
                <div 
                  className="text-right border rounded-xl px-4 py-2 transition-all duration-500"
                  style={{ backgroundColor: `${activeColor}08`, borderColor: `${activeColor}22` }}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-gray-500">Starting purse</p>
                  <p className="text-[18px] font-semibold leading-tight transition-colors duration-500" style={{ color: activeColor }}>₹120 Cr</p>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-[#3d3d40] italic">No team selected yet</p>
            )}
          </div>
 
          {/* CTAs with Kinetic State Transitions */}
          <div className="flex gap-3">
            <button
              disabled={!isFormValid}
              onClick={startBriefingFlow}
              className={`flex-1 py-4 rounded-2xl text-[15px] font-medium flex items-center justify-center gap-2 transition-all duration-500 ${
                isFormValid
                  ? "text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-black/40"
                  : "bg-white/[0.04] text-white/20 cursor-not-allowed border border-white/[0.06]"
              }`}
              style={{ backgroundColor: isFormValid ? activeColor : "" }}
            >
              <Zap className={`w-4 h-4 ${isFormValid ? "animate-pulse text-white" : "opacity-30"}`} />
              {isFormValid ? "Start Auction." : "Awaiting Signatures"}
            </button>
            <button
              onClick={() => setShowMultiplayerAlert(true)}
              className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-[20px] rounded-2xl px-5 py-4 text-[14px] text-[#86868b] hover:text-[#adadb0] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              Multiplayer
            </button>
          </div>
        </div>
 
        {/* Multiplayer modal */}
        {showMultiplayerAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fadeIn">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-scaleIn">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#f5f5f7] mb-2">Multiplayer coming soon</h2>
              <p className="text-[13px] text-[#86868b] leading-relaxed mb-6">
                Laksh is building real-time multiplayer functionality. Stay Tuned for the Ultimate IPL Auction Experience.
              </p>
              <button
                onClick={() => setShowMultiplayerAlert(false)}
                className="w-full bg-white/90 text-black py-3 rounded-xl text-[14px] font-medium hover:bg-white transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showBriefing) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 overflow-y-auto selection:bg-amber-500/30" style={fontStyle}>
        <div className="max-w-6xl mx-auto">
          
          {/* Header Area - Clean & Spaced */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-fadeIn">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-b from-pink-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-24 h-28 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-4">
                  <img src={teamLogos[selectedTeam]} className="w-full h-full object-contain" alt="logo" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-black tracking-tighter">{playerName}</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">owner. • {selectedTeam}</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-3xl font-black tabular-nums text-white/10 tracking-tighter">EST. 2008</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Card 1 */}
            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all duration-500 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4">Advanced Scouting Features.</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                Use the Search Sidebar to find your "Target Players." Mark them with a Star to trigger a visual alert when they hit the auction hammer.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all duration-500 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4">The Vault.</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                ₹120 Crore in your treasury. Use it wisely; every crore counts. Dominate or save to hunt the legends.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all duration-500 group">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4">Outsmart the AI.</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                You aren't alone. 9 intelligent AI bots are programmed to steal your players. Beware of the <span className="text-red-400">Last-Second Snatch</span> in the final 2 seconds.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all duration-500 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4">Dev note.</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                Built by a fan, for the fans. If you spot a bug or have a "killer feature" idea, your feedback is the fuel that makes this game better.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-16">
            <div className="flex-1 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-8 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Boxes className="w-10 h-10 text-amber-500/50" />
                <div className="text-left">
                  <h3 className="text-xs font-black tracking-[0.3em] uppercase text-amber-500 mb-2">Championship Blueprint</h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><span className="text-xs font-bold text-gray-300">Min 15 Players</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><span className="text-xs font-bold text-gray-300">5 Bat | 2 Wk | 4 All | 4 Bowl</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-xs font-bold text-gray-300">Max 4 Overseas</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 bg-white/[0.03] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
               <Zap className="w-8 h-8 text-amber-500/40" />
               <div className="text-left">
                 <h3 className="text-[10px] font-black tracking-widest uppercase text-gray-500">Bidding Sequence</h3>
                 <p className="text-[11px] font-bold text-gray-400 uppercase mt-1">Bat → Wk → All → Bowl</p>
               </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={commenceAuction} 
              className="group relative inline-flex items-center justify-center px-12 py-6 font-black tracking-[0.2em] text-black bg-amber-500 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.2)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative uppercase text-lg">start auction.</span>
              <ChevronLeft className="relative w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        <footer className="max-w-[1400px] mx-auto mt-12 mb-8 px-4" style={fontStyle}>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white font-bold text-sm uppercase tracking-widest">contact us on.</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Laksh63dave" target="_blank" className="text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Github</a>
              <a href="https://www.instagram.com/lakshhh_63/" target="_blank" className="text-gray-500 hover:text-pink-500 transition-all text-xs font-bold uppercase tracking-widest">Instagram</a>
              <a href="https://www.linkedin.com/in/lakshdave18/" target="_blank" className="text-gray-500 hover:text-blue-500 transition-all text-xs font-bold uppercase tracking-widest">LinkedIn</a>
            </div>
            <div className="text-[10px] text-gray-600 font-medium tracking-tight">© 2026 Laksh Dave. All rights reserved.</div>
          </div>
        </footer>
      </div>
    );
  }

  // --- SCREEN 3: COUNTDOWN ---
  if (isCountingDown) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden" style={fontStyle}>
        {/* Background Shockwave Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse"></div>
        
        <div className="relative">
          {/* Shadow Number */}
          <h1 className="text-[20rem] md:text-[30rem] font-black text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 italic scale-150">
            {countdownNum}
          </h1>
          
          {/* Main Number with Glitchy Shake */}
          <h1 className="relative text-[12rem] md:text-[20rem] font-black text-white tracking-tighter animate-bounceIn drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {countdownNum}
          </h1>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-[2px] w-12 bg-amber-500 animate-width"></div>
          <p className="text-amber-500 font-black tracking-[0.8em] uppercase text-[10px] animate-pulse">
            ladies and gentlemen, you're not ready for this!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-4" style={fontStyle}>
        
        <div className="max-w-[1400px] mx-auto mb-4 flex items-center justify-between">
          <div className="flex items-center bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-1">
            <div className="px-4 py-1 border-r border-white/10">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Purse</span>
              <span className="text-green-400 font-bold text-lg leading-tight">₹{userTeam?.purse}Cr</span>
            </div>
            <div className={`px-4 py-1 transition-all ${timer <= 3 ? "bg-red-500/20" : ""}`}>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Timer</span>
              <span className={`font-bold text-lg leading-tight tabular-nums ${timer <= 3 ? "text-red-400 animate-pulse" : "text-orange-400"}`}>{timer}s
                <div className="w-full h-1 mt-2 bg-white/10 rounded-full overflow-hidden">
                <div
                className={`h-full ${timer <= 3 ? "bg-red-500" : "bg-orange-400"} transition-all`}
                style={{ width: `${(timer / 10) * 100}%` }}
                />
                </div>
              </span>
            </div>
            <button onClick={() => setShowReq(true)} className="px-4 py-2 hover:bg-white/5 transition-all border-l border-white/10 text-xs font-bold uppercase flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Requirements
            </button>
            <button onClick={() => { setShowTeamsModal(true); setViewingTeam(null); }} className="px-4 py-2 hover:bg-white/5 transition-all border-l border-white/10 text-xs font-bold uppercase flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Teams
            </button>
            <button onClick={() => setShowUnsoldModal(true)} className="px-4 py-2 hover:bg-white/5 transition-all border-l border-white/10 text-xs font-bold uppercase flex items-center gap-2">
              <Zap className="w-4 h-4" /> Unsold
            </button>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
             <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Active Set: {player?.role}</span>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto flex gap-4">
          <div className="w-1/5 p-4 rounded-2xl bg-white/5 border border-white/10 h-[78vh] flex flex-col overflow-hidden">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition text-white"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-4">
              {Object.entries(filteredPool).map(([role, list]) => (
                list.length > 0 && (
                  <div key={role} className="flex flex-col">
                    <h3 className="text-[10px] text-amber-500/80 font-black uppercase tracking-widest mb-2 border-l-2 border-amber-500 pl-2">
                      {role}
                    </h3>
                    <div className="space-y-1">
                      {list.map((p: any, i: number) => {
                        const boughtTeam = teams.find(t => t.squad.some((s: any) => s.name === p.name));
                        const isPlayerSold = !!boughtTeam;
                        const soldPrice = boughtTeam?.squad.find((s: any) => s.name === p.name)?.price;
                        
                        return (
                          <div key={i} className={`flex items-center justify-between group py-1.5 border-b border-white/5 ${isPlayerSold ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-1.5 max-w-[85%] truncate text-left">
                              <span className="text-[11px] text-gray-400 font-medium truncate">{p.name}</span>
                              
                              {/* TEXT ADDITION: (SOLD - ₹PRICE Cr) */}
                              {isPlayerSold && (
                                <span className="text-[10px] font-bold text-red-500/80 flex-shrink-0 tracking-tight">
                                  (SOLD - ₹{soldPrice}Cr)
                                </span>
                              )}
                            </div>
                            
                            {/* SHOW STAR ONLY IF PLAYER IS NOT SOLD */}
                            {!isPlayerSold ? (
                              <button onClick={() => toggleFavorite(p.name)} className="transition-transform active:scale-125">
                                <Star className={`w-3 h-3 ${favorites.includes(p.name) ? "text-amber-400 fill-amber-400" : "text-gray-600 hover:text-gray-300"}`} />
                              </button>
                            ) : (
                              <div className="w-3 h-3" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {auctionEnded ? (
                <div className="w-full max-w-lg p-10 rounded-3xl text-center bg-[#0a0a0a] border border-white/10 shadow-2xl">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h1 className="text-3xl font-bold mb-2 text-white">Auction Complete</h1>
                    {!isSquadValid && <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-6 text-red-400 text-xs font-medium">⚠️ Requirements Not Met</div>}
                    <button onClick={() => window.location.reload()} className="bg-white text-black px-10 py-3 rounded-xl font-black hover:scale-105 transition">START NEW</button>
                </div>
            ) : (
                <div 
                  className="w-full max-w-lg p-8 rounded-[40px] text-center bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 shadow-2xl"
                  style={{ 
                    boxShadow: isFavoriteActive 
                      ? "0 0 50px rgba(251, 191, 36, 0.3)" 
                      : currentBidder 
                        ? `0 0 40px ${teamColors[currentBidder]}22` 
                        : player?.rating > 90 
                          ? "0 0 40px rgba(255, 215, 0, 0.15)" 
                          : "none" 
                  }}
                >
                  {isFavoriteActive && (
                    <div className="flex justify-center mb-2 animate-pulse">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                  )}

                  <div className={`text-[9px] mb-3 uppercase font-bold tracking-[0.2em] px-3 py-1 inline-block rounded-full ${player?.role === "Batsman" ? "bg-blue-500/20 text-blue-400" : player?.role === "Bowler" ? "bg-red-500/20 text-red-400" : player?.role === "All-rounder" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {player?.role}
                  </div>
                  <h1 className="text-4xl font-bold mb-1 tracking-tighter text-white">{player?.name}</h1>
                  
                  <div className="flex items-center justify-center gap-4 mb-6 mt-3">
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">⭐ {player?.rating} Rating</span>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{player?.style}</span>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">{player?.country}</span>
                    </div>
                  </div>

                  <div className="text-6xl font-black text-green-400 mb-8 tabular-nums tracking-tighter">₹{bid} Cr</div>
                  <div className="mb-8 min-h-[36px] flex items-center justify-center gap-3">
                    {currentBidder && <img src={teamLogos[currentBidder]} className="w-7 h-7 object-contain drop-shadow-lg" />}
                    <span
                    className="text-lg font-bold tracking-tight flex items-center gap-2"
                    style={{ color: currentBidder ? teamColors[currentBidder] : "#666" }}
                    >
                    {currentBidder ? ` is leading.` : "Awaiting Bids..."}
                    </span>
                  </div>
                  
                  <button 
                    onClick={increaseBid} 
                    disabled={currentBidder === userTeam?.name || sold}
                    className={`px-14 py-4 rounded-2xl font-black text-lg transition-all text-white shadow-xl 
                      ${currentBidder === userTeam?.name ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}`}
                    style={{ 
                      background: currentBidder ? `linear-gradient(135deg, ${teamColors[currentBidder]}, #000)` : "linear-gradient(135deg, #ff0381, #dc2626)", 
                      boxShadow: currentBidder ? `0 15px 30px ${teamColors[currentBidder]}44` : "0 15px 30px rgba(255, 0, 128, 0.2)" 
                    }}
                  >
                    {currentBidder === userTeam?.name ? "✅ LEADING" : `💲 BID ₹${(bid + (bid >= 20 ? 1 : bid >= 10 ? 0.5 : 0.25)).toFixed(2)} Cr`}
                  </button>
                </div>
            )}
          </div>

          <div className="w-1/5 p-4 rounded-2xl bg-white/5 border border-white/10 h-[78vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-2.5 px-3 py-3 bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-xl border border-white/10 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.08] hover:scale-[1.02] transition-all duration-300">
            <div className="relative">
            <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center border border-white/10 overflow-hidden"
            style={{
              boxShadow: userTeam?.name 
              ? `0 0 18px ${teamColors[userTeam.name]}55` 
              : "0 0 10px rgba(255,255,255,0.05)"
            }}
            >
            {userTeam?.name && (
              <img src={teamLogos[userTeam.name]} className="w-7 h-7 object-contain" alt="team" />
              )}
            </div>
            </div>
            <div className="flex flex-col text-left overflow-hidden leading-tight">
              <span className="text-[13px] font-semibold text-white truncate">
                {playerName || "Team Owner"}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {userTeam?.name && `- ${userTeam.name}`}
              </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              {userTeam?.name && <img src={teamLogos[userTeam.name]} className="w-4 h-4 object-contain" />}
              <h2 className="text-gray-500 text-[10px] font-bold uppercase truncate">My Squad {userTeam?.squad.length}/15</h2>
            </div>
            {userTeam?.squad.map((p: any, i: number) => (
              <div key={i} className="text-[11px] py-2 px-2 flex justify-between items-center rounded-lg hover:bg-white/5 transition border border-white/5 mb-1">
                <span className="truncate pr-2 text-gray-300 flex items-center gap-2 text-left">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    p.role === "Batsman" ? "bg-blue-400" :
                    p.role === "Bowler" ? "bg-red-400" :
                    p.role === "All-rounder" ? "bg-green-400" :
                    "bg-yellow-400"
                    }`} />
                    <span className="truncate">{p.name}</span>
                  </span>
                <span className="text-green-400 font-bold tabular-nums">₹{p.price}Cr</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="max-w-[1400px] mx-auto mt-12 mb-8 px-4" style={fontStyle}>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white font-bold text-sm uppercase tracking-widest">IPL Auction 2026</span>
              </div>
              <p className="text-gray-500 text-xs font-medium">Made with ❤️ by <span className="text-white">Laksh Dave</span></p>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Laksh63dave" target="_blank" className="text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Github</a>
              <a href="https://www.instagram.com/lakshhh_63/" target="_blank" className="text-gray-500 hover:text-pink-500 transition-all text-xs font-bold uppercase tracking-widest">Instagram</a>
              <a href="https://www.linkedin.com/in/lakshdave18/" target="_blank" className="text-gray-500 hover:text-blue-500 transition-all text-xs font-bold uppercase tracking-widest">LinkedIn</a>
            </div>
            <div className="text-[10px] text-gray-600 font-medium tracking-tight">© 2026 Laksh Dave. All rights reserved.</div>
          </div>
        </footer>
      </div>

      {sold && soldPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn" style={fontStyle}>
          <div className="relative px-12 py-8 rounded-[32px] text-center bg-[#0a0a0a] border border-white/10 animate-scaleIn shadow-2xl">
            <h2 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-[0.4em]">sold.</h2>
            {currentBidder && <img src={teamLogos[currentBidder]} className="w-12 h-12 mx-auto mb-4 object-contain" />}
            <p className="text-3xl font-bold mb-1 tracking-tighter text-white">{soldPlayer.name}</p>
            <p className="text-sm text-gray-400 mb-6 font-bold uppercase">{currentBidder || "Unsold"}</p>
            <div className={`text-2xl font-black tabular-nums ${soldPlayer.price === "UNSOLD" ? "text-red-500" : "text-green-400"}`}>{soldPlayer.price === "UNSOLD" ? "❌ UNSOLD" : `₹${soldPlayer.price} Cr`}</div>
          </div>
        </div>
      )}

      {/* --- UPDATED: SET INTRO TRANSITION OVERLAY --- */}
      {showSetIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-fadeIn" style={fontStyle}>
          <div className="text-center animate-scaleIn">
            <div className="flex justify-center mb-6">
               <div className="p-6 rounded-full bg-amber-500/10 border border-amber-500/20">
                 <Zap className="w-16 h-16 text-amber-500 animate-pulse" />
               </div>
            </div>
            <h2 className="text-gray-500 text-sm font-bold uppercase tracking-[0.5em] mb-2">Set Complete</h2>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase">
              UP NEXT: <span className="text-amber-500">{currentSet}s</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium tracking-wide">Strategy badalne ka waqt hai. Specialists are coming up...</p>
            <div className="mt-10 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      {showUnsoldModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4" style={fontStyle}>
          <div className="relative w-full max-w-md max-h-[75vh] overflow-hidden rounded-[32px] bg-[#0F0F0F] border border-white/10 p-8 shadow-2xl flex flex-col text-white">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest">Unsold Players</h2>
                <button onClick={() => setShowUnsoldModal(false)} className="text-gray-500 hover:text-white transition">✕</button>
             </div>
             <div className="overflow-y-auto flex-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {unsoldPlayers.length > 0 ? (
                  unsoldPlayers.map((p, i) => (
                    <div key={i} className="py-3 border-b border-white/5 text-gray-300 text-sm font-medium flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-gray-500 text-[10px] font-bold uppercase">{p.country}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 py-10 italic">No players are unsold yet.</p>
                )}
             </div>
          </div>
        </div>
      )}

      {showTeamsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" style={fontStyle}>
          <div className="relative w-full max-w-md max-h-[75vh] overflow-hidden rounded-[32px] bg-[#0F0F0F] border border-white/10 p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              {viewingTeam ? (<button onClick={() => setViewingTeam(null)} className="flex items-center gap-1 text-gray-400 hover:text-white transition"><ChevronLeft className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-widest">Back</span></button>) : <div className="w-8"></div>}
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">{viewingTeam ? "Squad" : "Teams"}</h2>
              <button onClick={() => setShowTeamsModal(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="overflow-y-auto pr-1 flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!viewingTeam ? (
                <div className="space-y-2">
                  {teams.sort((a, b) => b.purse - a.purse).map((team, i) => (
                    <div key={i} onClick={() => setViewingTeam(team)} className="flex items-center justify-between gap-4 bg-white/5 px-4 py-3 rounded-xl border border-white/5 hover:bg-white/10 transition cursor-pointer group">
                      <div className="flex items-center gap-3"><img src={teamLogos[team.name]} className="w-7 h-7 object-contain" /><span className={`text-xs font-bold ${team.isUser ? "text-amber-400" : "text-white"}`}>{team.name}</span></div>
                      <div className="flex items-center gap-3"><span className="text-green-400 font-bold tabular-nums text-xs">₹{team.purse}Cr</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="flex flex-col items-center mb-6 py-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                    <img src={teamLogos[viewingTeam.name]} className="w-10 h-10 object-contain mb-2" /><h3 className="text-lg font-bold tracking-tight text-white">{viewingTeam.name}</h3><p className="text-green-400 font-bold text-sm">₹{viewingTeam.purse} Cr</p>
                  </div>
                  <div className="space-y-1.5">
                    {viewingTeam.squad.length > 0 ? viewingTeam.squad.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 transition hover:bg-white/10">
                        <span className="text-xs text-gray-300 font-medium">{p.name}</span>
                        <span className="text-green-400 font-bold text-[11px] tabular-nums">₹{p.price} Cr</span>
                      </div>
                    )) : <p className="text-center text-gray-600 py-10 text-xs italic tracking-wide">No players bought yet.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" style={fontStyle}>
          <div className="relative w-full max-w-sm rounded-[32px] bg-[#0F0F0F] border border-white/10 p-8 shadow-2xl">
            <button onClick={() => setShowReq(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">✕</button>
            <h2 className="text-center text-xs font-bold mb-6 text-white uppercase tracking-widest">Requirements</h2>
            <div className="space-y-3">
              {[{ label: "Batsman", count: userCounts.Batsman, target: 5 }, { label: "Bowler", count: userCounts.Bowler, target: 4 }, { label: "All-rounder", count: userCounts["All-rounder"], target: 4 }, { label: "Wicketkeeper", count: userCounts.Wicketkeeper, target: 2 }].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bold text-xs tracking-wide">{item.label}</span>
                  <div className="flex items-center gap-2"><span className={`text-lg font-black ${item.count >= item.target ? "text-green-400" : "text-orange-500"}`}>{item.count}</span><span className="text-gray-700 text-[10px] font-bold">/ {item.target}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}