import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, List, ListItem, ListItemText, Drawer
} from '@material-ui/core'
import Link from 'next/link'
import withRoot from '../components/withRoot'

// import { ip } from '../config.json'
// import * as fetch from 'isomorphic-unfetch'

/* interface Status {
  code: number, online: boolean, maxPlayers: number, playersOnline: number, versionName: string
} */
interface S {
  loggedIn: boolean, openDrawer: boolean
}

class Index extends React.Component<{}, S> {
  constructor (props: {}) {
    super(props)
    this.state = { loggedIn: false, openDrawer: false }
  }

  componentDidMount () {
    try {
      if (localStorage && localStorage.getItem('accessToken')) this.setState({ loggedIn: true })
    } catch (e) {}
  }

  render () {
    // Return the code.
    return (
      <div style={{ display: 'flex' }}>
        <head>
          <title>Dashboard - ReConsole</title>
          {/* <meta property='og:url' content={`${rootURL}/`} /> */}
          {/* <meta property='og:description' content='' /> */}
          {/* <meta name='Description' content='IveBot is a multi-purpose Discord bot.' /> */}
        </head>
        <AppBar style={{ width: '100vw', zIndex: 1000000000 }}>
          <Toolbar>
            <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReConsole</Typography>
            <Link href='/about'><Button color='inherit'>About</Button></Link>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' style={{ flexShrink: 0, width: 200 }}>
          <div style={{ height: 64 }} />
          <List>
            {['Just a drawer'].map((text, index) => (
              <ListItem style={{ width: 200 }} button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <div style={{
          background: 'linear-gradient(to top, #fc00ff, #00dbde)',
          height: '100vh',
          width: `calc(100vw - 200px)`
        }}>
          <div style={{ paddingTop: '5em', paddingLeft: 20, paddingRight: 20 }}>
            <Paper style={{ padding: 10 }}>
              {!this.state.loggedIn ? (
                <Typography>
                  {'It doesn\'t look like you should be here.'}<Link prefetch href='/'>
                    <Typography color='primary' component='a'>Consider logging in?</Typography>
                  </Link>
                </Typography>
              ) : (<>
                <Typography>You are logged in, nice.</Typography>
              </>)}
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

export default withRoot(Index)
