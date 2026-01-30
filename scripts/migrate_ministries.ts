import { db } from '../app/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { CHURCH_DATA } from '../app/lib/constants';

async function migrate() {
    console.log("Starting migration...");

    // 1. Clear existing ministries in Firestore (optional, but good for clean start)
    const querySnapshot = await getDocs(collection(db, 'ministries'));
    for (const d of querySnapshot.docs) {
        await deleteDoc(doc(db, 'ministries', d.id));
    }
    console.log("Cleared existing ministries.");

    // 2. Add from CHURCH_DATA
    for (const ministry of CHURCH_DATA.ministries) {
        await addDoc(collection(db, 'ministries'), {
            ...ministry,
            created_at: new Date()
        });
        console.log(`Migrated: ${ministry.name}`);
    }

    console.log("Migration complete!");
}

migrate().catch(console.error);
