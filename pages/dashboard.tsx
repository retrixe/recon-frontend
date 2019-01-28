import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, Drawer, withWidth, IconButton, List, ListItem,
  ListItemText, ListItemIcon, Divider
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import TrendingUp from '@material-ui/icons/TrendingUp'
import Link from 'next/link'

import withRoot from '../components/withRoot'
import Statistics from '../components/statistics'

type PageName = 'Statistics'
interface S {
  loggedIn: boolean, openDrawer: boolean, currentPage: PageName
}

class Dashboard extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs'|'sm'|'md'|'lg'|'xl' }) {
    super(props)
    this.state = { loggedIn: false, openDrawer: false, currentPage: 'Statistics' }
  }

  async componentDidMount () {
    try {
      if (localStorage && localStorage.getItem('accessToken')) this.setState({ loggedIn: true })
    } catch (e) {}
  }

  render () {
    // Return the code.
    let PageToLoad = Statistics
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
            {this.props.width === 'xs' && this.state.loggedIn ? (<>
              <IconButton color='inherit' aria-label='Open drawer'
                onClick={() => this.setState({ openDrawer: !this.state.openDrawer })}
              ><MenuIcon /></IconButton>
              <div style={{ marginRight: 10 }} />
            </>) : ''}
            <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReConsole</Typography>
            <Link href='/about'><Button color='inherit'>About</Button></Link>
          </Toolbar>
        </AppBar>
        {this.state.loggedIn ? (
          <Drawer
            variant={drawerVariant} style={{ flexShrink: 0, width: 200 }}
            open={this.state.openDrawer}
            onClose={() => this.setState({ openDrawer: false })}
          >
            <div style={{ height: 64 }} />
            <List>
              {[
                { name: 'Statistics', icon: <TrendingUp /> }
              ].map((page: { name: PageName, icon: any }) => (<>
                <ListItem style={{ width: 200 }} button key={page.name} onClick={
                  () => this.setState({ currentPage: page.name })
                }>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItem>
                <Divider />
              </>))}
            </List>
          </Drawer>
        ) : ''}
        <div style={drawerVariant === 'temporary' || !this.state.loggedIn ? {
          background: 'linear-gradient(to top, #fc00ff, #00dbde)', height: '100vh', width: '100vw'
        } : {
          background: 'linear-gradient(to top, #fc00ff, #00dbde)',
          height: '100vh',
          width: `calc(100vw - 200px)`
        }}>
          <div style={{ paddingTop: '5em', paddingLeft: 20, paddingRight: 20 }}>
            {!this.state.loggedIn ? (
              <Paper style={{ padding: 10 }}>
                <Typography>
                  {'It doesn\'t look like you should be here.'}<Link prefetch href='/'>
                    <Typography color='primary' component='a'>Consider logging in?</Typography>
                  </Link>
                </Typography>
              </Paper>
            ) : <PageToLoad />}
          </div>
        </div>
      </div>
    )
  }
}

export default withRoot(withWidth()(Dashboard))
