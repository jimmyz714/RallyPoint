import { useState, FormEvent } from "react";
import { useStore, CivicEvent, EventType } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { organizations, addEvent } = useStore();

  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("Local org");
  const [type, setType] = useState<EventType>("Event");
  const [orgId, setOrgId] = useState(organizations[0]?.id || "");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !dateStr || !location) return;

    const selectedOrg = organizations.find(o => o.id === orgId);

    const newEvent: CivicEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      dateStr,
      location,
      topic,
      type,
      organization: selectedOrg?.name || "Unknown Org",
      orgId,
      description,
      attendees: 0,
    };

    addEvent(newEvent);
    navigate("/");
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 flex flex-col relative pb-16 overflow-y-auto transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 px-4 py-4 flex items-center border-b border-gray-200 dark:border-gray-800 transition-colors">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">Add New Opportunity</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Event title..." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Date & Time String</label>
          <input required value={dateStr} onChange={e => setDateStr(e.target.value)} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Thu Apr 24 · 6:30 PM" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Location</label>
          <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Venue or Link..." />
        </div>
        <div className="flex gap-4">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Topic Label</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Type</label>
            <select value={type} onChange={e => setType(e.target.value as EventType)} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="Event">Event</option>
              <option value="Opportunity">Opportunity</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Host Organization</label>
          <select 
            required 
            value={orgId} 
            onChange={e => setOrgId(e.target.value)} 
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {organizations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Description</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <button type="submit" className="w-full bg-emerald-600 dark:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-6 transition-colors hover:bg-emerald-700 dark:hover:bg-emerald-600">
          Save and Publish
        </button>
      </form>
    </div>
  )
}
