"use client";
import { useState, useEffect } from "react";
import { Zap, Trophy, ClipboardList, LayoutGrid, ChevronLeft, Users } from "lucide-react";
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

export default function Home() {
  const teamsUI = [
    { code: 'MI', name: 'Mumbai Indians', color: '#004BA0' },
    { code: 'RR', name: 'Rajasthan Royals', color: '#dd0c83' },
    { code: 'RCB', name: 'Royal Challengers Bangalore', color: '#ff0000' },
    { code: 'GT', name: 'Gujarat Titans', color: '#0c2140' },
    { code: 'DC', name: 'Delhi Capitals', color: '#05a3ff' },
    { code: 'PBKS', name: 'Punjab Kings', color: '#ed1b1b' },
    { code: 'CSK', name: 'Chennai Super Kings', color: '#ffd000' },
    { code: 'SRH', name: 'Sunrisers Hyderabad', color: '#eb5d1b' },
    { code: 'KKR', name: 'Kolkata Knight Riders', color: '#2e1652' },
    { code: 'LSG', name: 'Lucknow Super Giants', color: '#cb165e' },
  ];

  const iplTeams = teamsUI.map(t => t.name);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamUI, setSelectedTeamUI] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players] = useState(() => shuffleArray(playersData));
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

  useEffect(() => {
    if (!selectedTeam || auctionEnded) return;
    if (timer === 0) {
      sellPlayer();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, selectedTeam, auctionEnded]);

  useEffect(() => {
    if (!selectedTeam || teams.length === 0 || auctionEnded) return;
    const player = players[index];
    if (!player) return;
    const aiTeams = teams.filter((t) => !t.isUser);
    const ai = aiTeams[Math.floor(Math.random() * aiTeams.length)];
    if (!canAddPlayer(ai, player)) return;
    let increment = 0.25;
    if (bid >= 10 && bid < 20) increment = 0.5;
    else if (bid >= 20) increment = 1;
    let chance = 0.2;
    if (player.base === 2) chance += 0.4;
    else if (player.base === 1) chance += 0.2;
    const count = ai.squad.filter((p: any) => p.role === player.role).length;
    if (
      (player.role === "Batsman" && count < 5) ||
      (player.role === "Bowler" && count < 4) ||
      (player.role === "All-rounder" && count < 4) ||
      (player.role === "Wicketkeeper" && count < 2)
    ) {
      chance += 0.25;
    }
    if (ai.purse > 70) chance += 0.1;
    if (ai.purse < 30) chance -= 0.2;
    const maxLimit = player.base * 5;
    if (bid >= maxLimit) return;
    if (Math.random() < 0.3) return;
    const delay = timer <= 3 ? Math.random() * 500 : 800 + Math.random() * 800;
    const timeout = setTimeout(() => {
      const willBid = Math.random() < chance;
      if (willBid && ai.purse >= increment) {
        setBid((prev: number) => +(prev + increment).toFixed(2));
        setCurrentBidder(ai.name);
        setTimer(10);
        setHasBid(true);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [bid, index, timer]);

  const increaseBid = () => {
    const user = teams.find((t) => t.isUser);
    if (!user) return;
    const currentPlayer = players[index];
    if (!canAddPlayer(user, currentPlayer)) {
      alert("Overseas limit full 🌍");
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
          if (t.name === currentBidder && canAddPlayer(t, current)) {
            return { ...t, purse: +(t.purse - bid).toFixed(2), squad: [...t.squad, { ...current, price: bid }] };
          }
          return t;
        })
      );
    } else {
      setSoldPlayer({ ...current, price: "UNSOLD" });
      setUnsoldPlayers((prev) => [...prev, current]);
    }

    setTimeout(() => {
      if (index + 1 >= players.length) {
        setAuctionEnded(true);
        setSold(false);
        return;
      }
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setBid(players[nextIndex]?.base || 2);
      setSold(false);
      setSoldPlayer(null);
      setTimer(10);
      setHasBid(false);
      setCurrentBidder(null);
    }, 2000);
  };

  const userTeam = teams.find((t) => t.isUser);
  const player = players[index];
  const userCounts = userTeam ? getRoleCounts(userTeam.squad) : { Batsman: 0, Bowler: 0, "All-rounder": 0, Wicketkeeper: 0 };
  const isSquadValid = userCounts.Batsman >= 5 && userCounts.Bowler >= 4 && userCounts["All-rounder"] >= 4 && userCounts.Wicketkeeper >= 2;

  if (!selectedTeam) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4" style={fontStyle}>
        <div className="w-full max-w-2xl bg-[#0D0D0D] rounded-2xl p-6">
          <div className="mb-6">
            <label className="text-gray-400 text-sm">Your Name</label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full mt-2 bg-[#1A1A1A] p-4 rounded-xl text-white outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-400 text-sm">Choose Your Team</label>
            <div className="flex flex-wrap gap-3 mt-3">
              {teamsUI.map((team) => (
                <button
                  key={team.code}
                  onClick={() => setSelectedTeamUI(team.code)}
                  className={`w-12 h-12 rounded-full text-xs font-bold transition-all ${
                    selectedTeamUI === team.code ? "scale-110 ring-2 ring-amber-500" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: team.color, boxShadow: selectedTeamUI === team.code ? `0 0 20px ${team.color}` : "none" }}
                >
                  {team.code}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                const team = teamsUI.find(t => t.code === selectedTeamUI);
                if (team) setSelectedTeam(team.name);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition"
            >
              <Zap className="w-5 h-5" />
              Create Room
            </button>
            <button
              onClick={() => setShowMultiplayerAlert(true)}
              className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition"
            >
              <Users className="w-5 h-5" />
              Play With Friends
            </button>
          </div>
        </div>

        {showMultiplayerAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Multiplayer Coming Soon</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Laksh is working on the Firebase integration. Real-time ipl auction with friends is on its way! 🛠️👨‍💻
              </p>
              <button 
                onClick={() => setShowMultiplayerAlert(false)}
                className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Got it, Laksh! 👍
              </button>
            </div>
          </div>
        )}
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
              <span className={`font-bold text-lg leading-tight tabular-nums ${timer <= 3 ? "text-red-400 animate-pulse" : "text-orange-400"}`}>{timer}s</span>
            </div>
            <button onClick={() => setShowReq(true)} className="px-4 py-2 hover:bg-white/5 transition-all border-l border-white/10 text-xs font-bold uppercase flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Requirements
            </button>
            <button onClick={() => { setShowTeamsModal(true); setViewingTeam(null); }} className="px-4 py-2 hover:bg-white/5 transition-all border-l border-white/10 text-xs font-bold uppercase flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Teams
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto flex gap-4">
          <div className="w-1/5 p-4 rounded-2xl bg-white/5 border border-white/10 h-[78vh] overflow-y-auto">
            <h2 className="text-gray-400 mb-3 text-xs font-bold uppercase tracking-widest">❌ Unsold</h2>
            {unsoldPlayers.map((p, i) => (
              <div key={i} className="text-xs text-gray-400 mb-1.5 font-medium pb-1 border-b border-white/5">{p.name}</div>
            ))}
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
                  style={{ boxShadow: currentBidder ? `0 0 40px ${teamColors[currentBidder]}22` : player?.rating > 90 ? "0 0 40px rgba(255, 215, 0, 0.15)" : "none" }}
                >
                  <div className={`text-[9px] mb-3 uppercase font-bold tracking-[0.2em] px-3 py-1 inline-block rounded-full ${player?.role === "Batsman" ? "bg-blue-500/20 text-blue-400" : player?.role === "Bowler" ? "bg-red-500/20 text-red-400" : player?.role === "All-rounder" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {player?.role}
                  </div>
                  <h1 className="text-4xl font-bold mb-1 tracking-tighter text-white">{player?.name}</h1>
                  <div className="text-gray-500 mb-6 text-sm font-semibold tracking-tight">⭐ {player?.rating} Rating </div>
                  <div className="text-6xl font-black text-green-400 mb-8 tabular-nums tracking-tighter">₹{bid} Cr</div>
                  <div className="mb-8 min-h-[36px] flex items-center justify-center gap-3">
                    {currentBidder && <img src={teamLogos[currentBidder]} className="w-7 h-7 object-contain drop-shadow-lg" />}
                    <span className={`text-lg font-bold tracking-tight ${currentBidder ? "text-white" : "text-gray-600"}`}>{currentBidder || "Awaiting Bids..."}</span>
                  </div>
                  <button onClick={increaseBid} className="px-14 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-white shadow-xl" style={{ background: currentBidder ? `linear-gradient(135deg, ${teamColors[currentBidder]}, #000)` : "linear-gradient(135deg, #ff0381, #dc2626)", boxShadow: currentBidder ? `0 15px 30px ${teamColors[currentBidder]}44` : "0 15px 30px rgba(255, 0, 128, 0.2)" }}>
                    💲 BID ₹{bid + (bid >= 20 ? 1 : bid >= 10 ? 0.5 : 0.25)} Cr
                  </button>
                </div>
            )}
          </div>

          <div className="w-1/5 p-4 rounded-2xl bg-white/5 border border-white/10 h-[78vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              {userTeam?.name && <img src={teamLogos[userTeam.name]} className="w-4 h-4 object-contain" />}
              <h2 className="text-gray-500 text-[10px] font-bold uppercase truncate">My Squad ({userTeam?.squad.length})</h2>
            </div>
            {userTeam?.squad.map((p: any, i: number) => (
              <div key={i} className="text-[11px] py-1.5 flex justify-between border-b border-white/5 font-medium items-center">
                <span className="truncate pr-2 text-gray-300">{p.name}</span>
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
            <h2 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-[0.4em]">Hammer Down</h2>
            {currentBidder && <img src={teamLogos[currentBidder]} className="w-12 h-12 mx-auto mb-4 object-contain" />}
            <p className="text-3xl font-bold mb-1 tracking-tighter text-white">{soldPlayer.name}</p>
            <p className="text-sm text-gray-400 mb-6 font-bold uppercase">{currentBidder || "Unsold"}</p>
            <div className={`text-2xl font-black tabular-nums ${soldPlayer.price === "UNSOLD" ? "text-red-500" : "text-green-400"}`}>{soldPlayer.price === "UNSOLD" ? "❌ UNSOLD" : `₹${soldPlayer.price} Cr`}</div>
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
            <div className="overflow-y-auto pr-1 flex-1">
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
                    <img src={teamLogos[viewingTeam.name]} className="w-10 h-10 object-contain mb-2" /><h3 className="text-lg font-bold tracking-tight">{viewingTeam.name}</h3><p className="text-green-400 font-bold text-sm">₹{viewingTeam.purse} Cr</p>
                  </div>
                  <div className="space-y-1.5">
                    {viewingTeam.squad.length > 0 ? viewingTeam.squad.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 transition hover:bg-white/10"><span className="text-xs text-gray-300 font-medium">{p.name}</span><span className="text-green-400 font-bold text-[11px] tabular-nums">₹{p.price} Cr</span></div>
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