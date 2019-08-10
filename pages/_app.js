import App, { Container } from "next/app"
import React from "react"
import { ApolloProvider } from "react-apollo"
import NextSeo from "next-seo"
import Router from "next/router"
import NProgress from "nprogress"
import { ThemeProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import "draft-js/dist/Draft.css"
import "react-quill/dist/quill.snow.css" // QUILL

import SEO from "../next-seo.config"
import withApolloClient from "../lib/with-apollo-client"
import theme from "../lib/theme"
import StateContext from "../lib/StateContext"

Router.events.on("routeChangeStart", url => {
  // console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

class Admin extends App {
  state = {
    previousPagePath: null
  }
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  setPreviousPagePath = path => {
    this.setState({ previousPagePath: path })
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <NextSeo config={SEO} />
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <StateContext.Provider
              value={{
                setPreviousPagePath: this.setPreviousPagePath,
                previousPagePath: this.state.previousPagePath
              }}
            >
              <Component {...pageProps} />
            </StateContext.Provider>
          </ThemeProvider>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(Admin)
