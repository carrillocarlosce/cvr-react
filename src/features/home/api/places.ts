import { firestore } from "../../../services/firebase";
import { mapId } from '../../../utilities/mappers'
interface PlaceTypes {
    id: string;
    name: string;
}
export const getPlaces = async (): Promise<PlaceTypes[]> => {
    try {
        const places = await firestore.collection('places').get();
        return mapId(places.docs)
    } catch (error) {
        return error
    }
}
