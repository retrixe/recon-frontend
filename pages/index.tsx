import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, TextField
} from '@material-ui/core'
import Link from 'next/link'
import withRoot from '../components/withRoot'

const Index = () => (
  <div style={{ marginRight: 16, marginLeft: 16 }}>
    <head>
      <title>ReCon</title>
      {/* <meta property='og:url' content={`${rootURL}/`} /> */}
      {/* <meta property='og:description' content='' /> */}
      {/* <meta name='Description' content='IveBot is a multi-purpose Discord bot.' /> */}
    </head>
    <AppBar>
      <Toolbar>
        <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ReCon</Typography>
        <Link prefetch href='/about'><Button color='inherit'>About</Button></Link>
      </Toolbar>
    </AppBar>
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
    }}>
      <Paper elevation={24} style={{ flex: 1, padding: 10 }}>
        <Typography variant='headline'>Log In</Typography>
        <br /><Typography gutterBottom>
          Welcome to ReConsole! Enter your designated username and password to access console.
        </Typography>
        <TextField required label='Username' autoFocus fullWidth />
        <br /><br /><TextField required label='Password' fullWidth type='password' />
        <br /><br /><Button variant='contained' color='secondary' fullWidth>Log In</Button>
      </Paper>
    </div>
  </div>
)

export default withRoot(Index)
