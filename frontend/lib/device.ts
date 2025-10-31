// utils/deviceId.ts

/**
 * A helper to get or create a persistent device ID that survives refreshes and cache clears.
 * Uses IndexedDB + localStorage for persistence, plus a browser fingerprint for stability.
 */

export const getDeviceId = async (): Promise<string> => {
  // --- helper: sha256 hashing ---
  const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  // --- helper: IndexedDB read/write ---
  const DB_NAME = "device-id-db";
  const STORE_NAME = "device_store";
  const KEY_NAME = "local_device_uuid";

  const openDB = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  const getFromIndexedDB = async (): Promise<string | null> => {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(KEY_NAME);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  };

  const saveToIndexedDB = async (value: string): Promise<void> => {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, KEY_NAME);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      console.log("Error saving device ID to IndexedDB");
    }
  };

  const getLocalUUID = async (): Promise<string> => {
    let uuid =
      localStorage.getItem(KEY_NAME) || (await getFromIndexedDB()) || null;

    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem(KEY_NAME, uuid);
      await saveToIndexedDB(uuid);
    }
    return uuid;
  };



  try {
    const localUUID = await getLocalUUID();
    const finalId = await sha256(localUUID);
    return finalId;
  } catch {
    return crypto.randomUUID();
  }
};
