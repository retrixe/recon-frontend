import React from 'react'
import {
  Typography, Paper, Divider, TextField, Fab
} from '@material-ui/core'
import Check from '@material-ui/icons/Check'

import { ip } from '../../config.json'
import fetch from 'isomorphic-unfetch'
import { ConnectionFailure } from '../imports/connectionFailure'

interface S {
  console: string, listening: boolean, ws?: WebSocket, command: string
}

export default class Console extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { listening: false, command: '', console: 'Loading...' }
    this.executeCommand = this.executeCommand.bind(this)
  }

  async componentDidMount () {
    try {
      // Connect to console.
      let ws = new WebSocket(`${ip.split('http').join('ws')}:4269`)
      // This listener needs to be loaded ASAP.
      ws.onmessage = (event) => this.setState({ console: `${this.state.console}\n${event.data}` })
      this.setState({ ws, listening: true })
      // Register listeners.
      ws.onerror = () => {
        this.setState({ console: `${this.state.console}\nAn unknown error occurred.` })
      }
      ws.onclose = (event) => {
        this.setState({
          console: this.state.console + '\nThe connection to the server was abruptly closed.'
        })
        if (!event.wasClean) {} // Something.. later.
      }
    } catch (e) {
      console.error('Looks like an error occurred while connecting to console.\n' + e)
    }
  }

  // Close WebSocket when done.
  componentWillUnmount () { this.state.ws && this.state.ws.close() }

  async executeCommand () {
    try {
      if (!this.state.command) return
      this.setState({ console: `${this.state.console}\n>${this.state.command}` })
      const request = await (await fetch(
        `${ip}:4200/console/execute`, {
          headers: { 'Access-Token': localStorage.getItem('accessToken') },
          body: this.state.command,
          method: 'POST'
        }
      )).json()
      if (!request.success) console.error(`Failed to execute command: ${this.state.command}`)
      this.setState({ command: '' })
    } catch (e) { console.error(e) }
  }

  render () {
    // Return the code.
    if (!this.state.listening) return <ConnectionFailure />
    return (
      <>
        {/* Information about the server. */}
        <Paper style={{ padding: 20 }}>
          <Typography variant='h5' gutterBottom>Console</Typography>
          <Divider />
          <Paper style={{
            padding: 10, marginBottom: 10, backgroundColor: '#111111', height: '60vh'
          }}>
            <div style={{
              height: '100%',
              width: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse'
            }}>
              {this.state.console.split('\n').reverse().map((i, index) => (
                <Typography key={index} variant='body2' style={{ lineHeight: 1.5 }}>{i}</Typography>
              )).slice(0, 650) /* Truncate to 650 lines due to performance issues afterwards. */}
            </div>
          </Paper>
          <Divider />
          <Paper elevation={10} style={{ padding: 10, display: 'flex' }}>
            <TextField
              label='Input' value={this.state.command} fullWidth
              onChange={e => this.setState({ command: e.target.value })}
              onSubmit={this.executeCommand} color='secondary'
              onKeyPress={e => e.key === 'Enter' && this.executeCommand()}
            /><div style={{ width: 10 }} />
            <Fab color='secondary' onClick={this.executeCommand}><Check /></Fab>
          </Paper>
        </Paper>
      </>
    )
  }
}
