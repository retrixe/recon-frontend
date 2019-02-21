import * as React from 'react'
import {
  Typography, Paper, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  TextField, Fab
} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Add from '@material-ui/icons/Add'

import { ip } from '../../config.json'
import * as fetch from 'isomorphic-unfetch'

interface OperatorsList {
  code: number, operators: ({ name: string, uuid: string })[]
}

interface S { // eslint-disable-next-line no-undef
  operators?: OperatorsList, listening: boolean, interval?: NodeJS.Timeout, username: string
}

export default class Operators extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { listening: false, username: '' }
    this.opPlayer = this.opPlayer.bind(this)
  }

  async componentDidMount () {
    try {
      // Fetch operators.
      try {
        const operators = await (await fetch(ip + ':4200/operators', {
          headers: { 'Access-Token': localStorage.getItem('accessToken') }
        })).json()
        if (operators.code === 401) throw new Error()
        this.setState({ operators, listening: true })
      } catch (e) {}
      // Set an interval of 30 seconds to repeatedly update the operator list.
      const interval = setInterval(async () => {
        // Try to access the server.
        try {
          // Update the status.
          const operators = await (await fetch(ip + ':4200/operators', {
            headers: { 'Access-Token': localStorage.getItem('accessToken') }
          })).json()
          // If unauthorized, throw an error right now.
          // This will be handled later.
          if (operators.code === 401) throw new Error()
          this.setState({ operators, listening: true })
        } catch (e) {
          // We set listening to false.
          this.setState({ listening: false })
        }
        // Should happen every 30 seconds.
      }, 30000)
      // This can be server-side rendering error so we won't log on catch.
      // Client side rendering will alert the user anyways.
      // We set the interval in state to unregister it later..
      this.setState({ interval })
    } catch (e) {}
  }

  // Clear interval on timeout.
  componentWillUnmount () { clearInterval(this.state.interval) }

  async opPlayer () {
    try {
      const request = await (await fetch(
        `${ip}:4200/operators/addPlayerByName?name=${this.state.username}`,
        { headers: { 'Access-Token': localStorage.getItem('accessToken') } }
      )).json()
      if (!request.success) console.warn('Unable to op player.')
      else {
        this.setState({ username: '' })
        await this.componentDidMount()
      }
    } catch (e) {}
  }

  render () {
    // Return the code.
    if (!this.state.listening || !this.state.operators) {
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
          <Typography variant='h5' gutterBottom>Operators</Typography>
          <Divider />
          <div style={{ paddingBottom: 10 }} />
          <Typography variant='h6'>List of Operators</Typography>
          <div style={{ paddingBottom: 0 }} />
          {this.state.operators.operators.length ? (<List component='nav'>
            {this.state.operators.operators.map(i => (<div key={i.uuid}>
              <Divider /><ListItem>
                <ListItemText primary={i.name} />
                <ListItemSecondaryAction>
                  <IconButton aria-label='remove' onClick={async () => {
                    try {
                      const request = await (await fetch(
                        `${ip}:4200/operators/removePlayerByUUID?uuid=${i.uuid}`,
                        { headers: { 'Access-Token': localStorage.getItem('accessToken') } }
                      )).json()
                      if (!request.success) console.warn('Unable to de-op player.')
                      this.setState({ operators: {
                        ...this.state.operators,
                        operators: this.state.operators.operators.filter(
                          player => i.uuid !== player.uuid
                        )
                      } })
                    } catch (e) {}
                  }}><Delete /></IconButton>
                </ListItemSecondaryAction>
              </ListItem><Divider />
            </div>))}
          </List>) : <Typography>Looks like no one is an operator.</Typography>}
          <br /><Typography variant='h6'>OP Player</Typography>
          <div style={{ paddingBottom: 10 }} /><Divider />
          <Paper elevation={10} style={{ padding: 10, display: 'flex' }}>
            <TextField
              label='Username' value={this.state.username} fullWidth
              onChange={e => this.setState({ username: e.target.value })}
              onSubmit={this.opPlayer}
              onKeyPress={e => e.key === 'Enter' && this.opPlayer()}
            /><div style={{ width: 10 }} />
            <Fab color='secondary' onClick={this.opPlayer}><Add /></Fab>
          </Paper>
        </Paper>
      </>
    )
  }
}
