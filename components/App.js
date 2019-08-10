import React, { Component } from "react"
import PropTypes from "prop-types"
import Router, { withRouter } from "next/router"
import { Query } from "react-apollo"
import { withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import GoBackIcon from "@material-ui/icons/KeyboardArrowLeft"
import { checkToken } from "../lib/auth"
import Drawer from "../components/Drawer"
import USER from "../queries/user.gql"
import StateContext from "../lib/StateContext"
import Loading from "../components/Loading"

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
})

const mainPages = [
  "/",
  "/projects",
  "/admins",
  "/about",
  "/villages",
  "/news",
  "/tags",
  "/categories"
]
const checkIfMainPage = page => {
  let res = false
  mainPages.map(p => {
    if (p === page) {
      res = true
    }
  })
  return res
}

const App = props => {
  const { classes, router, children } = props
  const state = React.useContext(StateContext)
  const { previousPagePath, setPreviousPagePath } = state
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  React.useEffect(() => {
    router.events.on("beforeHistoryChange", url => {
      if (!checkIfMainPage(url)) {
        // console.log("TCL: url", url)
        setPreviousPagePath(router.asPath)
      }
    })
    return () => {
      router.events.off("beforeHistoryChange")
    }
  }, [router])
  React.useEffect(() => {
    if (previousPagePath && checkIfMainPage(router.pathname)) {
      setPreviousPagePath(null)
    }
  }, [])
  return (
    <Query query={USER}>
      {({ loading: loadingUser, error: errorUser, data: dataUser }) => {
        if (loadingUser) return <Loading />
        if (dataUser && dataUser.user) {
          if (dataUser.user.role === "CUSTOMER") {
            return <h1>Não autorizado</h1>
          }
          return (
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position='fixed' className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color='inherit'
                    aria-label='Open drawer'
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                  {previousPagePath ? (
                    <div>
                      <IconButton
                        color='inherit'
                        aria-label='Go back'
                        onClick={() => router.back(previousPagePath)}
                      >
                        <GoBackIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <div />
                  )}
                  <Typography variant='h6' color='inherit' noWrap>
                    Floresta Protegida
                  </Typography>
                </Toolbar>
              </AppBar>
              <Drawer
                user={dataUser.user}
                handleDrawerToggle={handleDrawerToggle}
                mobileOpen={mobileOpen}
                {...props}
              />
              <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
              </main>
            </div>
          )
        }
        Router.push("/login")
        return <h1>Redirecionando</h1>
      }}
    </Query>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
}

const withRoutingApp = withRouter(App)

export default withStyles(styles, { withTheme: true })(withRoutingApp)
