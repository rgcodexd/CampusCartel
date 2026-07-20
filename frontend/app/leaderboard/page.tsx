"use client";

import { useEffect, useState } from "react";
import { Trophy, Users } from "lucide-react";

export default function LeaderboardPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          setColleges(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Loading Leaderboard...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-full mb-4">
          <Trophy className="h-10 w-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Campus Leaderboard</h1>
        <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
          See which colleges have the most active and trusted communities on Campus Cartel.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-5 font-black text-zinc-500 uppercase tracking-wider text-sm w-16 text-center">Rank</th>
                <th className="p-5 font-black text-zinc-500 uppercase tracking-wider text-sm">College</th>
                <th className="p-5 font-black text-zinc-500 uppercase tracking-wider text-sm">Active Students</th>
                <th className="p-5 font-black text-zinc-500 uppercase tracking-wider text-sm">Avg Trust Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {colleges.map((college, index) => (
                <tr key={college.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-5 text-center font-black text-xl text-zinc-400">
                    {index === 0 ? <span className="text-yellow-500">1</span> :
                     index === 1 ? <span className="text-zinc-400">2</span> :
                     index === 2 ? <span className="text-amber-600">3</span> :
                     index + 1}
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-lg">{college.name}</p>
                    <p className="text-sm text-zinc-500">{college.city}{college.state ? `, ${college.state}` : ''}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 font-bold">
                      <Users className="h-4 w-4 text-primary" />
                      {college.student_count?.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-yellow-500 text-lg">★ {college.avg_trust}</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {colleges.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-zinc-500 font-medium">
                    No data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
