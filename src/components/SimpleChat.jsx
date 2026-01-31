import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { X, Send } from 'lucide-react';

export default function SimpleChat({ userId, userName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const subscription = subscribeToMessages();
    return () => subscription?.unsubscribe();
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles:user_id(first_name, avatar_url)')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setMessages(data);
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('chat-messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();
          setMessages(prev => [...prev, { ...payload.new, profiles: profile }]);
        }
      )
      .subscribe();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;
    setLoading(true);
    await supabase.from('chat_messages').insert({
      user_id: userId,
      message: newMessage.trim(),
      room_id: 'general'
    });
    setNewMessage('');
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '350px',
      height: '500px', background: '#1a1a2e', border: '1px solid #d4af37',
      borderRadius: '12px', display: 'flex', flexDirection: 'column', zIndex: 1000,
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: '#d4af37', margin: 0, fontSize: '16px' }}>General Chat</h3>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{messages.length} messages</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.user_id === userId ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ background: msg.user_id === userId ? '#d4af37' : 'rgba(255,255,255,0.1)', color: msg.user_id === userId ? '#000' : '#fff', padding: '8px 12px', borderRadius: '12px' }}>
              {msg.user_id !== userId && <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0', color: msg.user_id === userId ? '#000' : '#d4af37' }}>{msg.profiles?.first_name || 'User'}</p>}
              <p style={{ margin: 0, fontSize: '14px' }}>{msg.message}</p>
              <p style={{ fontSize: '10px', margin: '4px 0 0 0', opacity: 0.7 }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 12px', color: '#fff', outline: 'none' }} />
        <button type="submit" disabled={!newMessage.trim() || loading} style={{ background: '#d4af37', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#000', fontWeight: 'bold', cursor: 'pointer', opacity: (!newMessage.trim() || loading) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
