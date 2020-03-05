import 'spectre.css'
import '../custom.css'

import App, { Container } from 'next/app'
import Head from 'next/head'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <title>MetaSwap</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="MetaSwap is a protocol that leverages metatransactions to enable instant, economically-trustless, 'gassless' swaps between multiple assets, EVM chains, and Lightning invoices."
          />
          <meta property="og:type" content="website" />
          <meta name="og:title" property="og:title" content="MetaSwap" />
          <meta
            name="og:description"
            property="og:description"
            content="MetaSwap is a protocol that leverages metatransactions to enable instant, economically-trustless, 'gassless' swaps between multiple assets, EVM chains, and Lightning invoices."
          />
          <meta property="og:url" content="https://metaswap.io" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="MetaSwap" />
          <meta
            name="twitter:description"
            content="MetaSwap is a protocol that leverages metatransactions to enable instant, economically-trustless, 'gassless' swaps between multiple assets, EVM chains, and Lightning invoices."
          />
          <meta name="twitter:site" content="https://metaswap.io" />
          <meta name="twitter:creator" content="@hitchcott" />
          <link rel="icon" type="image/png" href="/icon.png" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta property="og:image" content="https://metaswap.io/icon.png" />
          <meta name="twitter:image" content="https://metaswap.io/icon.png" />
        </Head>
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
