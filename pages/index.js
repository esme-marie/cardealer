import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { connectToDatabase } from '../lib/mongodb'

const Home = ({ cars }) => {
  console.log('cars: ', cars)

  const inventory = cars.map((car) => {
    let stock = {}
    if (car.sold === true) {
        stock["id"] = car._id;
        stock["price"] = car.price
    } else {
        stock["id"] = car._id;
        stock["price"] = ""
    }
    return stock;
  });
  const sales = inventory.filter(stock => stock.price)
  console.log('sales: ', sales)

  let totSales = 0;
  sales.map((car) => {
    totSales += Number(car.price)
  })
  console.log('totSales: ', totSales)

  return (
    <div className="center">
      <h1 className="header">Welcome to Car Dealer!</h1>
      <h3>Total Sales (MYR): {Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(totSales)}</h3>
      <Link href="/sales">
        <a className={styles.button}>View Sales</a>
      </Link>
    </div>
  );
}

export async function getServerSideProps() {
  // // get the current environment
  // let dev = process.env.NODE_ENV !== 'production';
  // let { DEV_URL, PROD_URL } = process.env;

  // // request cars from api
  // // let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/cars`);

  // // extract the data
  // let data = await response.json();

  // console.log('data: ', data)

  let { db } = await connectToDatabase();
    // fetch the cars
    let cars = await db
        .collection('cars')
        .find({})
        .sort({ addedOn: -1 })
        .toArray();

  return {
    props: {
        cars: JSON.parse(JSON.stringify(cars)),
    },
  };
};
 
export default Home;
