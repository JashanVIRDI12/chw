import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
    collection, deleteDoc, doc, getDocFromServer, getDocsFromServer,
    getFirestore, orderBy, query, serverTimestamp, setDoc
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

let app;
let database;

export function getFirebaseApp() {
    if (!app) {
        for (const key of ['apiKey', 'authDomain', 'projectId', 'appId']) {
            if (!firebaseConfig[key] || firebaseConfig[key].includes('YOUR_')) {
                throw new Error('Firebase is not configured. Fill in js/firebase-config.js.');
            }
        }
        app = initializeApp(firebaseConfig);
    }
    return app;
}

function getDatabase() {
    if (!database) database = getFirestore(getFirebaseApp());
    return database;
}

export async function isAdminUser(user) {
    const snapshot = await getDocFromServer(doc(getDatabase(), 'admins', user.uid));
    return snapshot.exists();
}

export async function saveLead({ name, phone, email, page }) {
    const ref = doc(collection(getDatabase(), 'leads'));
    await setDoc(ref, {
        id: ref.id, name, phone, email, page,
        created_at: serverTimestamp()
    });
}

export async function fetchLeads() {
    const snapshot = await getDocsFromServer(
        query(collection(getDatabase(), 'leads'), orderBy('created_at', 'desc'))
    );
    return snapshot.docs.map(snapshot => {
        const lead = snapshot.data();
        return {
            ...lead,
            id: snapshot.id,
            // Keep the dashboard's ISO date strings while storing real timestamps.
            created_at: lead.created_at?.toDate
                ? lead.created_at.toDate().toISOString()
                : lead.created_at || null
        };
    });
}

export async function deleteLeadById(id) {
    await deleteDoc(doc(getDatabase(), 'leads', id));
}
