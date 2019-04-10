export const mapId = (docs) => {
    return docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
}