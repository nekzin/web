import BarChart from '@/components/BarChart/BarChart';
import Page from '@/components/layout/Page/Page';

const HomePage = (): React.ReactNode => (
  <Page>
    <h1>ВКИ Класс</h1>

    <BarChart
      // data={data}
      dimensions={{ width: 700, height: 450 }}
      color="steelblue"
    />

  </Page>
);

export default HomePage;
