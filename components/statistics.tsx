import * as React from 'react'
import {
  Typography, Paper
} from '@material-ui/core'

// import { ip } from '../config.json'
// import * as fetch from 'isomorphic-unfetch'

interface S {}

export default class Dashboard extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    try {
    /*
      // Check if the server is online.
      this.setState({ status: await (await fetch(ip + ':4200/')).json(), listening: true })
      // Set an interval of 10 seconds to repeatedly check if the server listens.
      // TODO: Test behaviour.
      setInterval(async () => {
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
    */
    } catch (e) {}
  }
  render () {
    // Return the code.
    return (
      <Paper style={{ padding: 10 }}>
        <Typography>You are logged in \o/</Typography>
      </Paper>
    )
  }
}
