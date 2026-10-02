export const dynamic = 'force-dynamic';
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const categories = ["YouTube Channel", "Instagram Page", "Website", "Domain", "App", "Business"];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", category: "YouTube Channel", info: "", price: "", img: "", whatsapp: "" });
  const [status, setStatus] = useState("");
  const load = async () => {
    const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (data) setListings(data);
  };
  useEffect(() => { load(); }, []);
  const sellNow = async (e:any) => {
    e.preventDefault();
    if(!form.title ||!form.price ||!form.whatsapp) return alert("Fill required!");
    setStatus("Uploading...");
    const { error } = await supabase.from("listings").insert([form]);
    if(error) alert(error.message);
    else { setStatus("✅ LIVE!"); setForm({ title: "", category: "YouTube Channel", info: "", price: "", img: "", whatsapp: "" }); load(); }
  };
  return (
    <main style={{fontFamily:"system-ui", background:"#f5f7fa", minHeight:"100vh", padding:10}}>
      <div style={{background:"#131921", color:"#fff", padding:18, textAlign:"center", fontSize:24, fontWeight:"bold"}}>🟢 HATTIZON - LIVE (Next.js)</div>
      <div style={{background:"#fff", borderRadius:14, padding:14, margin:"12px auto", maxWidth:600, border:"2px solid #febd69"}}>
        <h3>🔥 Sell Your Asset</h3>
        <form onSubmit={sellNow} style={{display:"flex", flexDirection:"column", gap:7}}>
          <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}} />
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}}>
            {categories.map(c=><option key={c}>{c}</option>)}
          </select>
          <input placeholder="Details" value={form.info} onChange={e=>setForm({...form,info:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}} />
          <input required placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}} />
          <input placeholder="Image URL" value={form.img} onChange={e=>setForm({...form,img:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}} />
          <input required placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} style={{padding:12, borderRadius:10, border:"1px solid #ddd"}} />
          <button style={{background:"#febd69", border:"none", padding:12, borderRadius:10, fontWeight:"bold"}}>List Now - Go LIVE 🚀</button>
          <p style={{color:"green", fontSize:13}}>{status}</p>
        </form>
      </div>
      <div style={{maxWidth:800, margin:"0 auto"}}>
        {listings.map((l:any)=><div key={l.id} style={{background:"#fff", borderRadius:14, padding:14, margin:"12px 0"}}><img src={l.img || "https://via.placeholder.com/400x200?text=HATTIZON"} style={{width:"100%", height:200, objectFit:"cover", borderRadius:10}}/><h3>{l.title}</h3><p>{l.category} | {l.info}</p><h2>₹{l.price}</h2><a href={`https://wa.me/${l.whatsapp}`} target="_blank"><button style={{background:"#25D366", color:"#fff", border:"none", padding:12, borderRadius:10, width:"100%"}}>WhatsApp</button></a></div>)}
      </div>
    </main>
  );
}
