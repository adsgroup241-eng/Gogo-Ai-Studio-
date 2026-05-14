import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check
async function testConnection() {
  try {
    // Only test if not on a build/lint runner where network might be restricted
    if (typeof window !== 'undefined') {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
  } catch (error: any) {
    // Silence "insufficient permissions" for the test doc, as we just want to check if the server is REACHABLE
    if (error?.code === 'permission-denied') return;
    
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore: Client appears to be offline.");
    } else {
      console.debug("Firestore connection test completed with status:", error?.code || error);
    }
  }
}

testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export const PROJECT_DURATIONS: Record<string, number> = {
  video: 240,    // 4 mins
  tiktok: 150,   // 2.5 mins
  music: 120,    // 2 mins
  voice: 60,     // 1 min
  ad: 120,       // 2 mins
  meeting: 180,  // 3 mins
};

export function calculateProjectProgress(createdAt: any, type: string) {
  if (!createdAt) return 0;
  
  const startTime = createdAt.toMillis ? createdAt.toMillis() : createdAt;
  const now = Date.now();
  const duration = (PROJECT_DURATIONS[type] || 60) * 1000;
  
  const elapsed = now - startTime;
  const progress = Math.min(Math.round((elapsed / duration) * 100), 100);
  
  return {
    progress,
    isCompleted: progress >= 100,
    elapsedSeconds: Math.floor(elapsed / 1000),
    totalSeconds: duration / 1000
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
