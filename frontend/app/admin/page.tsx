"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, ShieldAlert, LayoutDashboard, Users, ShoppingBag, AlertTriangle, Trash2, ShieldCheck, Eye, BadgeAlert } from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [token, setToken] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (data && data.role === "admin") {
      setIsAdmin(true);
      setToken(session.access_token);
      setCurrentUserId(session.user.id);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center flex justify-center items-center h-screen">Loading Admin Portal...</div>;

  if (!isAdmin) return (
    <div className="p-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-zinc-500">You must be an admin to view this page.</p>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-2 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
        <div className="px-4 py-4 mb-2">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Admin Portal</h2>
        </div>
        
        <button 
          onClick={() => setActiveTab("overview")} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
        >
          <LayoutDashboard className="w-5 h-5" /> Overview
        </button>
        <button 
          onClick={() => setActiveTab("verifications")} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'verifications' ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
        >
          <ShieldCheck className="w-5 h-5" /> Verifications
        </button>
        <button 
          onClick={() => setActiveTab("users")} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
        >
          <Users className="w-5 h-5" /> Users
        </button>
        <button 
          onClick={() => setActiveTab("listings")} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'listings' ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
        >
          <ShoppingBag className="w-5 h-5" /> Listings
        </button>
        <button 
          onClick={() => setActiveTab("reports")} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'reports' ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
        >
          <AlertTriangle className="w-5 h-5" /> Reports
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && <OverviewTab token={token} />}
          {activeTab === "verifications" && <VerificationsTab token={token} />}
          {activeTab === "users" && <UsersTab token={token} currentUserId={currentUserId} />}
          {activeTab === "listings" && <ListingsTab token={token} />}
          {activeTab === "reports" && <ReportsTab token={token} />}
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// Sub-Components
// ----------------------------------------------------

function OverviewTab({ token }: { token: string }) {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setMetrics(d.metrics)).catch(console.error);
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {!metrics ? <div>Loading metrics...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
            <h3 className="text-zinc-500 font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-foreground">{metrics.users}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
            <h3 className="text-zinc-500 font-medium mb-2">Active Listings</h3>
            <p className="text-4xl font-bold text-foreground">{metrics.listings}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
            <h3 className="text-zinc-500 font-medium mb-2">Pending Verifications</h3>
            <p className="text-4xl font-bold text-blue-500">{metrics.pendingVerifications}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
            <h3 className="text-zinc-500 font-medium mb-2">Pending Reports</h3>
            <p className="text-4xl font-bold text-red-500">{metrics.reports}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function VerificationsTab({ token }: { token: string }) {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/profiles/pending-verification`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setPendingUsers(d.items || [])).catch(console.error);
  }, [token]);

  const handleVerify = async (profileId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/profiles/verify/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) setPendingUsers(pendingUsers.filter(u => u.id !== profileId));
      else alert("Verification failed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pending ID Verifications</h1>
      {pendingUsers.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-12 text-center rounded-3xl border border-dashed">
          <p className="text-zinc-500">No pending verifications at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingUsers.map(user => (
            <div key={user.id} className="border rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg">{user.full_name || "Unknown"}</h3>
                <p className="text-sm text-zinc-500">{user.email}</p>
                <p className="text-sm text-zinc-500 mt-2"><span className="font-semibold">ID/Roll:</span> {user.student_id}</p>
              </div>
              <div className="flex-1 bg-zinc-100 dark:bg-black p-4 flex items-center justify-center min-h-[250px]">
                <img src={user.verification_image_url} alt="ID Card" className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm"/>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 border-t flex gap-3">
                <button onClick={() => handleVerify(user.id, 'approved')} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-medium transition">
                  <Check className="w-5 h-5" /> Approve
                </button>
                <button onClick={() => handleVerify(user.id, 'rejected')} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition">
                  <X className="w-5 h-5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ token, currentUserId }: { token: string, currentUserId: string }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setUsers(d.users || [])).catch(console.error);
  }, [token]);

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsers(users.filter(u => u.id !== id));
      else alert("Failed to delete user");
    } catch(err) { console.error(err); }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b">
            <tr>
              <th className="p-4 font-bold text-zinc-500 uppercase">User</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Role & Status</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Trust Score</th>
              <th className="p-4 font-bold text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                <td className="p-4">
                  <div className="font-bold">{u.full_name || "No Name"}</div>
                  <div className="text-zinc-500 text-xs">{u.email}</div>
                  <div className="text-zinc-500 text-xs mt-1">ID: {u.student_id || "N/A"}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                    {u.role.toUpperCase()}
                  </span>
                  {u.verification_status === 'approved' && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-500">
                      APPROVED
                    </span>
                  )}
                  {u.verification_status === 'rejected' && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-500">
                      REJECTED
                    </span>
                  )}
                  {u.verification_status === 'pending' && u.verification_image_url && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-500" title="User uploaded ID, ready for review">
                      PENDING (REVIEW)
                    </span>
                  )}
                  {u.verification_status === 'pending' && !u.verification_image_url && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-zinc-500/10 text-zinc-500" title="User has not uploaded an ID yet">
                      PENDING (NO ID)
                    </span>
                  )}
                </td>
                <td className="p-4 font-medium">{u.trust_score} / 5.0</td>
                <td className="p-4 text-right">
                  {u.id !== currentUserId && (
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingsTab({ token }: { token: string }) {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/listings`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setListings(d.listings || [])).catch(console.error);
  }, [token]);

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this listing?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setListings(listings.filter(l => l.id !== id));
      else alert("Failed to delete listing");
    } catch(err) { console.error(err); }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Listings Moderation</h1>
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b">
            <tr>
              <th className="p-4 font-bold text-zinc-500 uppercase">Item</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Owner</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Status</th>
              <th className="p-4 font-bold text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id} className="border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                <td className="p-4">
                  <div className="font-bold">{l.title}</div>
                  <div className="text-zinc-500 text-xs">{l.category} • {l.mode.toUpperCase()}</div>
                  <div className="text-primary font-medium mt-1">{l.price_label}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium">{l.profiles?.full_name || "Unknown"}</div>
                  <div className="text-xs text-zinc-500">{l.profiles?.email}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${l.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {l.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a href={`/listings/${l.id}`} target="_blank" className="inline-block p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition mr-1" title="View Listing">
                    <Eye className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(l.id)} className="inline-block p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Delete Listing">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab({ token }: { token: string }) {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setReports(d.reports || [])).catch(console.error);
  }, [token]);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/admin/reports/${id}/resolve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
      }
    } catch(err) { console.error(err); }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Trust & Safety Reports</h1>
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b">
            <tr>
              <th className="p-4 font-bold text-zinc-500 uppercase">Reported User</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Reason</th>
              <th className="p-4 font-bold text-zinc-500 uppercase">Status</th>
              <th className="p-4 font-bold text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No reports found.</td></tr>
            )}
            {reports.map(r => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                <td className="p-4">
                  <div className="font-bold text-red-500">{r.reported_user?.full_name || "Unknown"}</div>
                  <div className="text-zinc-500 text-xs">Reported by: {r.reporter?.full_name}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold">{r.reason_category}</div>
                  <div className="text-xs text-zinc-500 mt-1 max-w-[200px] truncate" title={r.description}>{r.description || "No description provided"}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${r.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {r.status === 'pending' ? (
                    <button onClick={() => handleResolve(r.id)} className="px-3 py-1.5 bg-primary text-white rounded-lg font-medium text-xs hover:opacity-90">
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-500 font-bold"><Check className="w-4 h-4 inline" /> Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
