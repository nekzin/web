import Link from 'next/link';
import Menu from '../Menu/Menu';
import styles from './Header.module.scss';

const Header = (): React.ReactElement => (
  <header className={styles.Header}>
    <Link href="/" className={styles.title} role="heading">
      ВКИ Класс
    </Link>
    <Menu />
  </header>
);

export default Header;
