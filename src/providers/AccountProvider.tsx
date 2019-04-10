import React, {Component} from 'react'
import firebaseApp from '../services/firebase';
// Set Up The Initial Context
const initialData: AccountTypes = {};
const AccountContext = React.createContext(initialData)
// Create an exportable consumer that can be injected into components
export const AccountConsumer = AccountContext.Consumer
// Create the provider using a traditional React.Component class
export interface UserTypes {
  uid: string,
  email: string,
  name: string,
  photoURL: string
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
    firebaseApp.auth()
    .onAuthStateChanged((next) => {
      if (next) {
        this.setUser({
          uid: next.uid,
          email: next.email,
          name: next.displayName,
          photoURL: next.photoURL
        })
      } else {
        this.signOut()
      }
      
    })
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