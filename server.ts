import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from 'fs';
import admin from 'firebase-admin';

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));

// Initialize Firebase Admin (to bypass security rules)
admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = admin.firestore(firebaseConfig.firestoreDatabaseId);

const PROJECT_DURATIONS: Record<string, number> = {
  video: 240,    // 4 mins
  tiktok: 150,   // 2.5 mins
  music: 120,    // 2 mins
  voice: 60,     // 1 min
  ad: 120,       // 2 mins
  meeting: 180,  // 3 mins
};

const MOCK_FILES: Record<string, string> = {
  video: "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5c15039f993d0d8504a9d70c446540c11d279d&profile_id=175",
  tiktok: "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5c15039f993d0d8504a9d70c446540c11d279d&profile_id=175",
  music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  voice: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  ad: "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5c15039f993d0d8504a9d70c446540c11d279d&profile_id=175",
  meeting: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
};

// Neural Processor - Simulated Background Worker
async function runNeuralProcessor() {
  console.log("🧠 Neural Processor: Initializing background rendering loop...");
  
  while (true) {
    try {
      const q = db.collection('projects')
        .where('status', '==', 'processing');
      
      const snapshot = await q.get();
      const now = Date.now();
      
      for (const projectDoc of snapshot.docs) {
        const data = projectDoc.data();
        const createdAt = data.createdAt as admin.firestore.Timestamp;
        if (!createdAt) continue;
        
        const startTime = createdAt.toMillis();
        const duration = (PROJECT_DURATIONS[data.type] || 60) * 1000;
        
        if (now - startTime >= duration) {
          console.log(`✅ Neural Processor: Finalizing project ${projectDoc.id} (${data.type})`);
          await projectDoc.ref.update({
            status: 'completed',
            url: MOCK_FILES[data.type] || MOCK_FILES.video,
            metadata: {
              duration: Math.floor(Math.random() * 180) + 30, // 30-210 seconds
              fileSize: `${(Math.random() * 200 + 50).toFixed(1)} MB`,
              quality: '4K Ultra HD',
              frameRate: '60fps'
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("❌ Neural Processor Error:", error);
    }
    
    // Check every 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "Neural protocols active", timestamp: new Date().toISOString() });
  });

  // Start Neural Processor in background
  runNeuralProcessor();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AI Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
