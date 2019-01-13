import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, TextField
} from '@material-ui/core'
import Link from 'next/link'
import withRoot from '../components/withRoot'
import * as fetch from 'isomorphic-unfetch'

import { ip } from '../config.json'

interface Status {
  code: number, online: boolean, maxPlayers: number, playersOnline: number, versionName: string
}
interface S {
  listening: boolean, status?: Status, username: string, password: string
}

class Index extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { listening: false, username: '', password: '' }
    this.login = this.login.bind(this)
  }

  async componentDidMount () {
    try {
      this.setState({ status: await (await fetch(ip + ':4200/')).json(), listening: true })
    } catch (e) {
      console.warn('Cannot connect to remote Minecraft server with ReConsole!\n' + e)
    }
  }

  async login () {
    if (!this.state.listening) return // Something here too which is intuitive.
    try {
      const request = await fetch(ip + ':4200/login', {
        method: 'POST', headers: { Username: this.state.username, Password: this.state.password }
      })
      const response = await request.json()
      if (!response.success) return // Handles will be inserted here with a special one for 401.
      // Save the access token in localStorage if we are on the client.
      try {
        if (localStorage && response.access_token
        ) localStorage.setItem('accessToken', response.access_token)
      } catch (e) {}
      // Log any errors if this fails.
    } catch (e) { console.error(e) }
  }

  render () {
    const status = this.state.status
    const versionName = this.state.status ? this.state.status.versionName : undefined
    return (
      <div style={{ marginRight: 16, marginLeft: 16 }}>
        <head>
          <title>ReCon</title>
          {/* <meta property='og:url' content={`${rootURL}/`} /> */}
          {/* <meta property='og:description' content='' /> */}
          {/* <meta name='Description' content='IveBot is a multi-purpose Discord bot.' /> */}
        </head>
        <AppBar>
          <Toolbar>
            <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReCon</Typography>
            <Link prefetch href='/about'><Button color='inherit'>About</Button></Link>
          </Toolbar>
        </AppBar>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
        }}>
          <Paper elevation={24} style={{ flex: 1, padding: 10 }}>
            <Typography variant='headline'>Status</Typography><br />
            <Typography>
              {this.state.listening && status && status.online
                ? `Online | ${versionName} | ${status.playersOnline}/${status.maxPlayers} online`
                : 'Cannot connect to server via ReConsole.'}
            </Typography>
            <hr /><Typography variant='headline'>Log In</Typography><br />
            <Typography gutterBottom>
              Welcome to ReConsole! Enter your designated username and password to access console.
            </Typography>
            <TextField required label='Username' fullWidth value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })} autoFocus />
            <br /><br />
            <TextField required label='Password' fullWidth value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })} type='password' />
            <br /><br />
            <Button variant='contained' color='secondary' fullWidth onClick={this.login}
              disabled={!this.state.username || !this.state.password}>
              Log In
            </Button>
          </Paper>
        </div>
      </div>
    )
  }
}

export default withRoot(Index)
