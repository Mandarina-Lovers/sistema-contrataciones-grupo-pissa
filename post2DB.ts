import {database} from './firebaseConfig';
import {ref, set} from 'firebase/database';

const post2DB = async (path: string, data: any) => {
 await set(ref(database, path), data);
}

export {post2DB};
