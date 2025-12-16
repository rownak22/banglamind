const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const quickRepliesDiv = document.getElementById('quick-replies');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

const API_URL = 'https://example.com/chatbot'; // Replace with your API
const JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MjY1MmZjNi0zNWM1LTQ2MGQtYTFiNC1iMjI3ZjBjNGM5YjQiLCJpYXQiOjE3NjU4ODUwNDAsIm5iZiI6MTc2NTg4NTA0MCwic2NvcGUiOiJyYXNhOnBybyByYXNhOnBybzpjaGFtcGlvbiByYXNhOnZvaWNlIiwiZXhwIjoxODYwNTc5NDQwLCJlbWFpbCI6InRhbWppZHRhbWppZDY0MkBnbWFpbC5jb20iLCJjb21wYW55IjoiUmFzYSBDaGFtcGlvbnMifQ.jz1BBMpe-WkYMurd82OegGJqgNumMiQ2U0ScqkTbUBQ-WYuMjVdXbgpKzhBHyzY_d7wGxzXPet1oC_Y8H6WdSgt_OR6nCENCUHpfvGI9U9OIwy5KgQrKPXJqQQEYH71fIatEiLdgFKH7oNBJhrMfmfKyenJ-8QyrJYsHw_Qsvkczl5dOQdjD4zsHTGrS4mFgL6HFOxI7vAc7bz8SW1BRub9x6sG6n4CtFoaVtIzR3z0UUzTLdM0Btm0aFObdT8UqzYVrHUucgOHPaN4b3Rah6uuPnvN3Lx_NuAGDjV4HXr2350PsWMM7RmF5C5sC5Nm6ufB9KdNpsK-fKSnCrHmlQw';

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });
emojiBtn.addEventListener('click', () => { emojiPicker.style.display = emojiPicker.style.display==='flex'?'none':'flex'; });

// Emoji picker setup
const emojis = ['😀','😅','😂','😊','😍','😎','😭','😡','👍','👎','🎉','💡'];
emojis.forEach(e => {
  const btn = document.createElement('button');
  btn.textContent = e;
  btn.addEventListener('click', () => { userInput.value += e; });
  emojiPicker.appendChild(btn);
});

// Send message
function sendMessage(){
  const message = userInput.value.trim();
  if(!message) return;
  addMessage(message,'user-msg');
  userInput.value = '';
  addQuickReplies([]);
  botReply(message);
}

// Add message
function addMessage(msg,className){
  const div = document.createElement('div');
  div.classList.add('message',className);
  div.textContent = msg;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Quick replies
function addQuickReplies(list){
  quickRepliesDiv.innerHTML='';
  list.forEach(r=>{
    const btn = document.createElement('button');
    btn.textContent = r;
    btn.addEventListener('click',()=>{ userInput.value=r; sendMessage(); });
    quickRepliesDiv.appendChild(btn);
  });
}

// Bot reply with API
async function botReply(userMsg){
  addMessage('Typing...','bot-msg');

  try{
    const response = await fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${JWT_TOKEN}`},
      body:JSON.stringify({message:userMsg})
    });
    const data = await response.json();
    const last = chatBox.querySelector('.bot-msg:last-child');
    if(last && last.textContent==='Typing...') last.remove();
    addMessage(data.reply || "Sorry, ami bujhte pari nai 😢",'bot-msg');

    if(data.quickReplies) addQuickReplies(data.quickReplies);

  }catch(err){
    const last = chatBox.querySelector('.bot-msg:last-child');
    if(last && last.textContent==='Typing...') last.remove();
    addMessage('API error 😢','bot-msg');
    console.error(err);
  }
}
