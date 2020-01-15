import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './global-style'
// import { Spinner } from './components/shared/spinner'
import CompanyLogo from './containers/company-logo'

console.info(`⚛️ ${React.version}`)

const App = () => (
  <>
    <GlobalStyle />
    {/* <Spinner /> */}
    <CompanyLogo />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

module.hot && module.hot.accept()
