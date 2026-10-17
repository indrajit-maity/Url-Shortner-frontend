import { useAuth } from "../context/AuhtContext";


export default function DashBoard(){
  const {logout}=useAuth();
  return(
    <div className="mx-auto max-w-3xl p-10">
      <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
      <p className="mt-2 text-ink/60">You're logged in. Your links will show up here.</p>
      <button onClick={logout} className="mt-6 rounded-md border border-line px-4 py-2 hover:bg-white">
        Log out
      </button>
    </div>
  );
}