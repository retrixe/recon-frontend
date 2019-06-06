import React from 'react'
import {
  Typography, Paper, Divider, FormControlLabel, Checkbox, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, TextField, Fab
} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Add from '@material-ui/icons/Add'

import { ip } from '../../config.json'
import fetch from 'isomorphic-unfetch'

interface WhitelistStats {
  code: number, enabled: boolean, whitelistedPlayers: ({ name: string, uuid: string })[]
}

interface S { // eslint-disable-next-line no-undef
  whitelist?: WhitelistStats, listening: boolean, interval?: NodeJS.Timeout, username: string
}

export default class Whitelist extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { listening: false, username: '' }
    this.addPlayerToWhitelist = this.addPlayerToWhitelist.bind(this)
  }

  async componentDidMount () {
    try {
      // Fetch statistics.
      try {
        const whitelist = await (await fetch(ip + ':4200/whitelist', {
          headers: { 'Access-Token': localStorage.getItem('accessToken') }
        })).json()
        if (whitelist.code === 401) throw new Error()
        this.setState({ whitelist, listening: true })
      } catch (e) {}
      // Set an interval of 30 seconds to repeatedly update the whitelist.
      const interval = setInterval(async () => {
        // Try to access the server.
        try {
          // Update the status.
          const whitelist = await (await fetch(ip + ':4200/whitelist', {
            headers: { 'Access-Token': localStorage.getItem('accessToken') }
          })).json()
          // If unauthorized, throw an error right now.
          // This will be handled later.
          if (whitelist.code === 401) throw new Error()
          this.setState({ whitelist, listening: true })
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

  async addPlayerToWhitelist () {
    try {
      const request = await (await fetch(
        `${ip}:4200/whitelist/addPlayerByName?name=${this.state.username}`,
        { headers: { 'Access-Token': localStorage.getItem('accessToken') } }
      )).json()
      if (!request.success) console.warn('Unable to clear player from whitelist.')
      else {
        this.setState({ username: '' })
        await this.componentDidMount()
      }
    } catch (e) {}
  }

  render () {
    // Return the code.
    if (!this.state.listening || !this.state.whitelist) {
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
          <Typography variant='h5' gutterBottom>Whitelist</Typography>
          <Divider />
          <FormControlLabel control={
            <Checkbox
              checked={this.state.whitelist.enabled}
              onChange={async () => {
                try {
                  await (await fetch(ip + ':4200/whitelist/toggle', {
                    headers: { 'Access-Token': localStorage.getItem('accessToken') }
                  })).json()
                  this.setState({ whitelist: {
                    ...this.state.whitelist, enabled: !this.state.whitelist.enabled
                  } })
                } catch (e) {}
              }}
            />
          } label='Enable Whitelist' />
          <div style={{ paddingBottom: 10 }} />
          <Typography variant='h6'>List of Whitelisted Players</Typography>
          <div style={{ paddingBottom: 0 }} />
          {this.state.whitelist.whitelistedPlayers.length ? (<List component='nav'>
            {this.state.whitelist.whitelistedPlayers.map(i => (<div key={i.uuid}>
              <Divider /><ListItem>
                <ListItemText primary={i.name} />
                <ListItemSecondaryAction>
                  <IconButton aria-label='remove' onClick={async () => {
                    try {
                      const request = await (await fetch(
                        `${ip}:4200/whitelist/removePlayerByUUID?uuid=${i.uuid}`,
                        { headers: { 'Access-Token': localStorage.getItem('accessToken') } }
                      )).json()
                      if (!request.success) console.warn('Unable to clear player from whitelist.')
                      this.setState({ whitelist: {
                        ...this.state.whitelist,
                        whitelistedPlayers: this.state.whitelist.whitelistedPlayers.filter(
                          player => i.uuid !== player.uuid
                        )
                      } })
                    } catch (e) {}
                  }}><Delete /></IconButton>
                </ListItemSecondaryAction>
              </ListItem><Divider />
            </div>))}
          </List>) : <Typography>Looks like no one is whitelisted.</Typography>}
          <br /><Typography variant='h6'>Add Player To Whitelist</Typography>
          <div style={{ paddingBottom: 10 }} /><Divider />
          <Paper elevation={10} style={{ padding: 10, display: 'flex' }}>
            <TextField
              label='Username' value={this.state.username} fullWidth
              onChange={e => this.setState({ username: e.target.value })}
              onSubmit={this.addPlayerToWhitelist}
              onKeyPress={e => e.key === 'Enter' && this.addPlayerToWhitelist()}
            /><div style={{ width: 10 }} />
            <Fab color='secondary' onClick={this.addPlayerToWhitelist}><Add /></Fab>
          </Paper>
        </Paper>
      </>
    )
  }
}
