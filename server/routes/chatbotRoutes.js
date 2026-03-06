const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Chat = require('../models/Chat');
const { protect: auth } = require('../middleware/auth');
const crisisDetection = require('../middleware/crisisDetection'); // ✅ add this
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Zen, a compassionate and empathetic mental health 
support assistant built for the Zen Wellness App. Your role is to:
- Listen actively and respond with empathy and kindness
- Help users manage stress, anxiety, and difficult emotions
- Suggest healthy coping strategies like breathing exercises and journaling
- Encourage users to track their mood regularly
- Always recommend professional help for serious mental health concerns
- Never diagnose any condition or recommend medication
- Keep responses concise, warm and supportive
- If user mentions self-harm or suicide, immediately provide these crisis resources:
  iCall: 9152987821
  Vandrevala Foundation: 1860-2662-345
  AASRA: 9820466627`;

// GET /api/chatbot/messages — fetch chat history
router.get('/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    const messages = chat ? chat.messages : [];
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not fetch messages' });
  }
});

// POST /api/chatbot/message — send message
router.post('/message', auth, crisisDetection, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // ✅ Input Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, error: 'Message too long. Max 1000 characters.' });
    }

    // Get or create chat history
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Last 10 messages for context
    const history = chat.messages.slice(-10).map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.message
    }));

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message }
      ]
    });

    const replyText = response.choices[0].message.content;

    // Build message objects matching frontend format
    const userMessage = {
      _id: `user-${Date.now()}`,
      message: message,
      isUser: true,
      createdAt: new Date().toISOString()
    };

    const botMessage = {
      _id: `bot-${Date.now()}`,
      message: replyText,
      isUser: false,
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB
    chat.messages.push(userMessage);
    chat.messages.push(botMessage);
    await chat.save();

    res.json({ 
      success: true, 
      data: { userMessage, botMessage } 
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, error: 'Something went wrong.' });
  }
});

// DELETE /api/chatbot/messages — clear chat
router.delete('/messages', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user.id },
      { messages: [] }
    );
    res.json({ success: true, message: 'Chat cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not clear chat' });
  }
});

module.exports = router;