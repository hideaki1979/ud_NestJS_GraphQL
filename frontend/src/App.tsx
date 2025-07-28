import { ApolloProvider } from '@apollo/client'
import './App.css'
import { GuestRoute, PrivateRoute } from './AuthRoute'
import Main from './components/Main'
import NotFound from './components/NotFound'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import client from './apolloClient'

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path='/signin' element={<GuestRoute children={<SignIn />} />} />
          <Route path='/signup' element={<GuestRoute children={<SignUp />} />} />
          <Route path='/' element={<PrivateRoute children={<Main />} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App
