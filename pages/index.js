// pages/index.js

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PixiSlotMachine from '../components/PixiSlotMachine';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        {/* Head content */}
      </Head>

      <main className={styles.main}>
        {/* Other content */}
        <PixiSlotMachine />
      </main>

      <footer className={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  );
}
