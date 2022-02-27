import Link from "next/link";
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useState } from 'react';

const Sales = ({ cars }) => {
    console.log('cars: ', cars)

    const [sold, setSold] = useState(false);
    const router = useRouter();

   // Add sales
    const deleteSales = async (carId) => {
        // change sold state
        setSold(false);
        console.log(sold);

        try {
            // Update sold
            await fetch('/api/cars', {
                method: 'PUT',
                body: carId,
            });
            // re-direct page to /sales
            return router.push(router.asPath);
        } catch (error) {
            // Stop sold state
            return setSold(true);
        }
    };

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

    return (
        <>
            <div>
                <h1 className="header">Sales</h1>
            </div>
            <div>
                <Link href="/add-sales">
                    <a className={styles.addSales}>Add Sales</a>
                </Link>
            </div>
            <div className={styles.container}>
                {cars.length === 0 || sales.length === 0 ? (
                    <h2 className="center">No sales!</h2>
                ) : (
                    <ul className="noBullets">
                        {cars.map((car, i) => (
                            <li key={i}>
                                {car.sold ? (
                                    <>
                                        <span className={styles.car}>{car.brand} {car.model} <b className={styles.sku}>[SKU: {car.sku}]</b></span>
                                        <div>MYR {Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(car.price)}</div>
                                        <small className="date">{new Date(car.soldOn).toLocaleDateString()}</small><br/>
                                        <button className={styles.delete} type="button" onClick={() => deleteSales(car['_id'])}>Delete</button>
                                        <hr className="divider"></hr>
                                    </>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
        
    );
}

export async function getServerSideProps() {
    // get the current environment
    let dev = process.env.NODE_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // request cars from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/cars`);

    // extract the data
    let data = await response.json();

    console.log('data: ', data)

    return {
        props: {
            cars: data['message'],
        },
    };
};
 
export default Sales;
