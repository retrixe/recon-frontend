import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, Drawer, withWidth, IconButton, List, ListItem,
  ListItemText, ListItemIcon, Divider
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import TrendingUp from '@material-ui/icons/TrendingUp'
import Fingerprint from '@material-ui/icons/Fingerprint'
import Security from '@material-ui/icons/Security'
import Settings from '@material-ui/icons/Settings'
import Link from 'next/link'

import { ip } from '../config.json'
import * as fetch from 'isomorphic-unfetch'

import withRoot from '../components/imports/withRoot'
import Statistics from '../components/dashboard/statistics'
import Whitelist from '../components/dashboard/whitelist'
import Operators from '../components/dashboard/operators'
import ServerProperties from '../components/dashboard/serverProperties'

type PageName = 'Statistics'|'Whitelist'|'Operators'|'Properties'
interface S {
  loggedIn: boolean, openDrawer: boolean, currentPage: PageName
}

const description = `The dashboard for the Minecraft server.\nReConsole \
is a Minecraft server control dashboard which allows efficient and easy to set up server \
administration.`

class Dashboard extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs'|'sm'|'md'|'lg'|'xl' }) {
    super(props)
    this.state = { loggedIn: false, openDrawer: false, currentPage: 'Statistics' }
  }

  async componentDidMount () {
    try {
      if (
        localStorage && localStorage.getItem('accessToken') && (await (await fetch(
          ip + ':4200/login/validate',
          { headers: { 'Access-Token': localStorage.getItem('accessToken') } }
        )).json()).success
      ) this.setState({ loggedIn: true })
    } catch (e) {}
  }

  render () {
    // Return the code.
    let PageToLoad: any = Statistics
    if (this.state.currentPage === 'Whitelist') PageToLoad = Whitelist
    else if (this.state.currentPage === 'Operators') PageToLoad = Operators
    else if (this.state.currentPage === 'Properties') PageToLoad = ServerProperties
    const drawerVariant = this.props.width === 'xs' ? 'temporary' : 'permanent'
    return (
      <div style={{ display: 'flex' }}>
        <>
          <title>Dashboard - ReConsole</title>
          {/* <meta property='og:url' content={`${rootURL}/`} /> */}
          <meta property='og:description' content={description} />
          <meta name='Description' content={description} />
        </>
        {/* The AppBar. */}
        <AppBar style={{ width: '100vw', zIndex: this.props.width !== 'xs' ? 1000000000 : 1 }}>
          <Toolbar>
            {this.props.width === 'xs' && this.state.loggedIn ? (<>
              <IconButton color='inherit' aria-label='Open drawer'
                onClick={() => this.setState({ openDrawer: !this.state.openDrawer })}
              ><MenuIcon /></IconButton>
              <div style={{ marginRight: 10 }} />
            </>) : ''}
            <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReConsole</Typography>
            <Link href='/'><Button color='inherit' onClick={() => {
              try { localStorage.removeItem('accessToken') } catch (e) {}
            }}>Logout</Button></Link>
            <div style={{ marginRight: 5 }} />
            <Link href='/about'><Button color='inherit'>About</Button></Link>
          </Toolbar>
        </AppBar>
        {/* The drawer. */}
        {this.state.loggedIn ? (
          <Drawer
            variant={drawerVariant} style={{ flexShrink: 0, width: 200 }}
            open={this.state.openDrawer}
            onClose={() => this.setState({ openDrawer: false })}
          >
            {this.props.width !== 'xs' ? <div style={{ height: 64 }} /> : ''}
            <List>
              {[
                { name: 'Statistics', icon: <TrendingUp /> },
                { name: 'Operators', icon: <Security /> },
                { name: 'Whitelist', icon: <Fingerprint /> },
                { name: 'Properties', icon: <Settings /> }
              ].map((page: { name: PageName, icon: any }) => (<div key={page.name}>
                <ListItem style={{ width: 200 }} button onClick={
                  () => this.setState({ currentPage: page.name })
                }>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItem>
                <Divider />
              </div>))}
            </List>
          </Drawer>
        ) : ''}
        {/* Everything other than the drawer. */}
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
                    <Typography color='primary' component='a' onClick={() => {
                      try { localStorage.removeItem('accessToken') } catch (e) {}
                    }}>Consider logging in?</Typography>
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
