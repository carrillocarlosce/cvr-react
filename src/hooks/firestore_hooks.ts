import { firestore } from "../services/firebase";
import { collection } from "rxfire/firestore";
import { map } from "rxjs/operators";
import { useState, useEffect } from "react";

export const useCollection = (query) => {
    const [docs, setDocs] = useState([])
    const col = collection(query).pipe(
        map(docs => {
            return docs.map(doc => {
                return{
                    ...doc.data(),
                    id: doc.id
                }
            })
        })
    )
    useEffect(() => {
        const updateDocs = (docs) => {
            setDocs(docs)
        }

        console.log('Subscribed')

        const subscription = col.subscribe(updateDocs)

        return () => {
            console.log('Unsubscribed')
            subscription.unsubscribe()
        }
    }, [])

    return docs;
}