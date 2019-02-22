import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, TextField, withWidth
} from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'
import withRoot from '../components/imports/withRoot'

import { ip } from '../config.json'
import * as fetch from 'isomorphic-unfetch'

interface Status {
  code: number, online: boolean, maxPlayers: number, playersOnline: number, versionName: string
}
interface S {
  listening: boolean, status?: Status, username: string, password: string, failedAuth: boolean,
  // eslint-disable-next-line no-undef
  interval?: NodeJS.Timeout
}

// TODO:
/*
- Support toggling background gradient.
- Support customizable titles for servers.
- Have a rootURL environment variable.
*/

const description = `Login page for the Minecraft server.\nReConsole is a \
Minecraft server control dashboard which allows efficient and \
easy to set up server administration.`

class Index extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
    super(props)
    this.state = { listening: false, username: '', password: '', failedAuth: false }
    this.login = this.login.bind(this)
  }

  async componentDidMount () {
    try {
      // Automatically forward to dashboard if logged in.
      try { if (localStorage.getItem('accessToken')) Router.push('/dashboard') } catch (e) {}
      // Check if the server is online.
      this.setState({ status: await (await fetch(ip + ':4200/')).json(), listening: true })
    } catch (e) {
      console.warn('Cannot connect to remote Minecraft server with ReConsole!\n' + e)
    }
    // Set an interval of 10 seconds to repeatedly check if the server listens.
    // TODO: Test behaviour.
    const interval = setInterval(async () => {
      // Try to access the server.
      try {
        // Update the status.
        this.setState({ status: await (await fetch(ip + ':4200/')).json(), listening: true })
      } catch (e) {
        if (this.state.listening) { // If it was listening before, we warn that it's not anymore.
          console.warn('Cannot connect to remote Minecraft server with ReConsole!\n' + e)
        } // Then we set listening to false.
        this.setState({ listening: false })
      }
      // Should happen every 10 seconds.
    }, 10000)
    // We set the interval in state to unregister it later..
    this.setState({ interval })
  }

  // Clear interval on timeout.
  componentWillUnmount () { clearInterval(this.state.interval) }

  async login () {
    if (!this.state.listening) return // Don't proceed if we're not listening.
    try {
      const request = await fetch(ip + ':4200/login', {
        method: 'POST', headers: { Username: this.state.username, Password: this.state.password }
      })
      const response = await request.json()
      // If request failed..
      if (!response.success) {
        // If it was an authentication error, we handle it by setting failedAuth to true.
        if (response.code === 401) this.setState({ failedAuth: true })
        // TODO: We'll have another handle here for other errors.
        return
      }
      // Save the access token in localStorage if we are on the client.
      // We'll add sessionStorage support later for Remember Me stuff.
      try {
        if (localStorage && response.access_token) {
          localStorage.setItem('accessToken', response.access_token)
          // Also, if authentication previously failed, let's just say it succeeded.
          this.setState({ failedAuth: false })
          // Then we redirect to the new page.
          Router.push('/dashboard')
        }
      } catch (e) {}
      // Log any errors if this fails (needs to change, TODO)
    } catch (e) { console.error(e) }
  }

  render () {
    // Smaller status.
    const status = this.state.status
    const versionName = status ? status.versionName : undefined
    // Responsive styling.
    const paperStyle = ['xs', 'sm'].includes(this.props.width) ? { flex: 1 } : { width: '33vw' }
    const allowLogin = !this.state.username || !this.state.password || !this.state.listening
    const ResponsiveButton = ['xs', 'sm'].includes(this.props.width) ? (
      <Button variant='contained' color='secondary' onClick={this.login} fullWidth
        disabled={allowLogin}>Log In</Button>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button variant='contained' color='secondary' onClick={this.login} disabled={allowLogin}>
          Log In
        </Button>
      </div>
    )
    // Return the code.
    return (
      <div style={{ background: 'linear-gradient(to top, #fc00ff, #00dbde)' }}>
        <div style={{ marginRight: 16, marginLeft: 16 }}>
          <>
            <title>ReConsole</title>
            {/* <meta property='og:url' content={`${rootURL}/`} /> */}
            <meta property='og:description' content={description} />
            <meta name='Description' content={description} />
          </>
          <AppBar>
            <Toolbar>
              <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReConsole</Typography>
              <Link href='/about'><Button color='inherit'>About</Button></Link>
            </Toolbar>
          </AppBar>
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
          }}>
            <Paper elevation={24} style={{ padding: 15, ...paperStyle }}>
              <Typography variant='h5'>Status</Typography><br />
              <Typography>
                {this.state.listening && status && status.online
                  ? `Online | ${versionName} | ${status.playersOnline}/${status.maxPlayers} online`
                  : 'Cannot connect to server via ReConsole.'}
              </Typography>
              <hr /><Typography variant='h5'>Log In</Typography><br />
              <Typography gutterBottom>
                Welcome to ReConsole! Enter your designated username and password to access console.
              </Typography>
              <TextField required label='Username' fullWidth value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })} autoFocus
                error={this.state.failedAuth} />
              <br /><br />
              <TextField required label='Password' fullWidth value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })} type='password'
                onSubmit={this.login} onKeyPress={e => e.key === 'Enter' && this.login()}
                error={this.state.failedAuth} />
              <br />{this.state.failedAuth ? (<><br />
                <Typography color='error'>Your username or password is incorrect.</Typography>
              </>) : ''}<br />
              {ResponsiveButton}
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

export default withRoot(withWidth()(Index))
