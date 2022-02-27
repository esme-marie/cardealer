import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react';

const Home = () => {
  const [cars, setCars] = useState(null)
  const [isLoading, setLoading] = useState(false)
  let totSales = 0

  useEffect(() => {
    setLoading(true)
    fetch('api/cars')
      .then((res) => res.json())
      .then((data) => {
        setCars(data)
        setLoading(false)
      })
  }, [])
  console.log('cars: ', cars)

  if (cars) {
    const inventory = cars.message.map((car) => {
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

    sales.map((car) => {
      totSales += Number(car.price)
    })
    console.log('totSales: ', totSales)
  }

  if (isLoading) return <p>Loading...</p>

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

export default Home;
