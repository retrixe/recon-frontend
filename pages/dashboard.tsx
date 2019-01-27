import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, Drawer, withWidth, IconButton, List, ListItem,
  ListItemText
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
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

class Index extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs'|'sm'|'md'|'lg'|'xl' }) {
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
    const drawerVariant = this.props.width === 'xs' ? 'temporary' : 'permanent'
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
            {this.props.width === 'xs' ? (
              <IconButton color='inherit' aria-label='Open drawer'
                onClick={() => this.setState({ openDrawer: !this.state.openDrawer })}
              ><MenuIcon /></IconButton>
            ) : ''}
            <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReConsole</Typography>
            <Link href='/about'><Button color='inherit'>About</Button></Link>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={drawerVariant} style={{ flexShrink: 0, width: 200 }}
          open={this.state.openDrawer}
          onClose={() => this.setState({ openDrawer: false })}
        >
          <div style={{ height: 64 }} />
          <List>
            {['Performance Metrics'].map(text => (
              <ListItem style={{ width: 200 }} button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <div style={drawerVariant === 'temporary' ? {
          background: 'linear-gradient(to top, #fc00ff, #00dbde)', height: '100vh', width: '100vw'
        } : {
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

export default withRoot(withWidth()(Index))
