import React, { useState, useEffect } from 'react';
import ReservationForm from '../../components/reservation_form/reservation_form';
import moment from 'moment';
import SearchResults from '../../components/search_results/search_results';
import { collection } from 'rxfire/firestore';
import { firestore } from '../../../../services/firebase';
import { map, tap } from 'rxjs/operators';
const Search = ({ match, history, location }) => {
    let params = new URLSearchParams(location.search);

    const [itineraries, setItneraries] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = {
        origin: params.get('o'),
        destination: params.get('d'),
        date: params.get('day')
    }

    const day = moment(queryParams.date, 'DD/MM/YYYY').get('day');

    const query = firestore.collection('itineraries')
        .where(`origin.id`, '==', queryParams.origin)
        .where(`destination.id`, '==', queryParams.destination)
        .where(`days`, 'array-contains', day)
    

    useEffect(() => {
        setLoading(true)
        const subscription = collection(query)
            .pipe(
                map(docs => 
                    docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                )
            )
            .subscribe(items => {
                console.log(items)
                setLoading(false)
                setItneraries(items)
            })
        return () => {
            subscription.unsubscribe()
        }
    }, [`${itineraries.length}${location.search}`])

    return (
        <div>
            <ReservationForm 
                onSubmit={(values) => {
                    const day = moment(values.date, 'DD/MM/YYYY').format('DDMMYYYY');
                    history.replace(`${match.path}search?o=${values.origin}&d=${values.destination}&day=${day}`)
                }}
                initialDestination={queryParams.destination}
                initialOrigin={queryParams.origin}
                initialDate={moment(queryParams.date, 'DDMMYYYY').format('DD/MM/YYYY')}
                loading={loading}
            />
            <SearchResults data={itineraries}/>
        </div>
    );
}
export default Search;