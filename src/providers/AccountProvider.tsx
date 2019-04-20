import React, {Component} from 'react'
import firebaseApp, { firestore } from '../services/firebase';
import { authState, user } from 'rxfire/auth';
import { docData } from 'rxfire/firestore';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
// Set Up The Initial Context
const initialData: AccountTypes = {};
const AccountContext = React.createContext(initialData)
// Create an exportable consumer that can be injected into components
export const AccountConsumer = AccountContext.Consumer
// Create the provider using a traditional React.Component class
export interface UserTypes {
  uid: string,
  email: string,
  name: string | null,
  photoURL: string | null,
  claims: any
}
export interface AccountTypes {
  user?: UserTypes | null
  authenticating?: boolean
  setUser?(user: UserTypes): void
  signOut?():void
}
class AccountProvider extends Component {
  constructor(props) {
    super(props);
    authState(firebaseApp.auth()).pipe(
      switchMap((user) => {
        return user ? docData<UserTypes>(firestore.doc(`users/${user.uid}`)) : of(null)
      })
    ).subscribe((user) => {
      console.log(user)
      if(user) {
        this.setUser({
          uid: user.uid,
          email: user.email,
          name: user.name || 'Usuario',
          photoURL: user.photoURL,
          claims: {}
        })
        firebaseApp.auth().currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          const claims = idTokenResult.claims;
          this.setUser({
            ...this.state.user,
            claims
          })
        })
      } else {
        this.signOut()
      }
    })
    // user(firebaseApp.auth())
    // .subscribe((user) => {
    //   if (user) {
    //     user.getIdTokenResult()
    //     .then((idTokenResult) => {
    //       const claims = idTokenResult.claims;
    //       this.setUser({
    //         ...this.state.user,
    //         claims
    //       })
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //   } else {
    //     this.signOut()
    //   }
    // })
  }
  state: AccountTypes = {
    user: null,
    authenticating: true,
    setUser: (user) => {
      this.setUser(user)
    },
    signOut: () => {
      this.signOut()
    }
  };

  signOut = () => {
    this.setState((prevState: AccountTypes) => ({
      ...prevState,
      user: null
    }))
  }

  setUser = (user: UserTypes) => {
    this.setState((prevState: AccountTypes) => ({
      ...prevState,
      authenticating: false,
      user
    }))
  }

  render () {
    return (
      // value prop is where we define what values 
      // that are accessible to consumer components
       <AccountContext.Provider value={this.state}>
        {this.props.children}
      </AccountContext.Provider>
    )
  }
}
export default AccountProvider