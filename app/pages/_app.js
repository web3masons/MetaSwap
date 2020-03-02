import 'spectre.css'
import '../custom.css'

import App, { Container } from 'next/app'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <div id="container">
          <div id="content">
            <Header />
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </Container>
    )
  }
}
