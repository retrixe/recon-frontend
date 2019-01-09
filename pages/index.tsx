import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography
} from '@material-ui/core'
import Link from 'next/link'
import withRoot from '../components/withRoot'

const Index = () => (
  <div style={{ marginRight: 16, marginLeft: 16 }}>
    <head>
      <title>ReCon-Frontend</title>
      {/* <meta property='og:url' content={`${rootURL}/`} /> */}
      {/* <meta property='og:description' content='' /> */}
      {/* <meta name='Description' content='IveBot is a multi-purpose Discord bot.' /> */}
    </head>
    <AppBar>
      <Toolbar>
        <Typography variant='title' color='inherit' style={{ flex: 1 }}>ReCon</Typography>
        <Link prefetch href='/about'><Button color='inherit'>About</Button></Link>
      </Toolbar>
    </AppBar>
    <br /><br /><br /><br />
  </div>
)

export default withRoot(Index)
