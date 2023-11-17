import Categories from '../Categories/Categories';
import Hero from '../Hero/Hero';
import TodayDeals from '../TodaysDeals/TodayDeals';

const Home = () => {
    return (
        <div className='min-h-screen w-screen'>
            <Hero/>
            <Categories/>
            <TodayDeals/>
            <TodayDeals/>
        </div>
    )
  };
  
  export default Home;