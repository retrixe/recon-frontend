import * as React from 'react'
import {
  Typography, Paper, Divider, TextField, Fab
} from '@material-ui/core'
import Check from '@material-ui/icons/Check'

import { ip } from '../../config.json'
import * as fetch from 'isomorphic-unfetch'

interface S { // eslint-disable-next-line no-undef
  console?: string, listening: boolean, ws?: WebSocket, command: string
}

export default class Console extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { listening: false, command: '' }
    this.executeCommand = this.executeCommand.bind(this)
  }

  async componentDidMount () {
    try {
      // Connect to console.
      let ws = new WebSocket(`${ip}:4269`)
      this.setState({ ws, listening: true })
      // Register listeners.
      ws.onerror = () => {
        console.error('Looks like an error occurred while connected to the gateway.')
      }
      ws.onmessage = (event) => this.setState({ console: event.data })
      ws.onclose = (event) => {
        if (!event.wasClean) {
          // Something.. later.
        }
      }
    } catch (e) {}
  }

  // Close WebSocket when done.
  componentWillUnmount () { this.state.ws.close() }

  async executeCommand () {
    try {
      const request = await (await fetch(
        `${ip}:4200/console/execute`, {
          headers: { 'Access-Token': localStorage.getItem('accessToken') },
          body: this.state.command
        }
      )).json()
      if (!request.success) console.warn('Unable to execute command.')
      else this.setState({ command: '' })
    } catch (e) {}
  }

  render () {
    // Return the code.
    if (!this.state.listening || !this.state.command) {
      return (
        <Paper style={{ padding: 10 }}>
          <Typography>Looks like we can{`'`}t connect to the server. Oops!</Typography>
          <Typography>
            Check if the server is online and the dashboard configured correctly.
          </Typography>
        </Paper>
      )
    }
    return (
      <>
        {/* Information about the server. */}
        <Paper style={{ padding: 20 }}>
          <Typography variant='h5' gutterBottom>Console</Typography>
          <Divider />
          <Paper style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: '#111111',
            height: '60vh'
          }}>
            <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
              {this.state.console}
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
