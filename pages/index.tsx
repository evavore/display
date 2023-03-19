import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { DisplayLaunches } from '../components/LaunchTable'

const HomeFooter = ()=>
  <footer className={styles.footer}>
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by{' '}
      <span className={styles.logo}>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span>
    </a>
  </footer>

const HomeHead = ()=>
  <Head>
    <title>SpaceX Launches</title>
    <meta name="description" content="A table view of SpaceX launches" />
    <link rel="icon" href="/favicon.ico" />
  </Head>

export default function Home() {
  return (
    <div className={styles.container}>
      <HomeHead />
      <DisplayLaunches />
      <HomeFooter />
    </div>
)}
