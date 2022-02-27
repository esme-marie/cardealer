import Link from "next/link";
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import Router from "next/router";

const Sales = () => {
    const [cars, setCars] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [sold, setSold] = useState(false)
    const sales = []

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

            // reload the page to load new info
            Router.reload() 

        } catch (error) {
            // Stop sold state
            return setSold(true);
        }
    };

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
        sales = inventory.filter(stock => stock.price)
        console.log('sales: ', sales)
    }

    if (isLoading) return <p>Loading...</p>
    if (!cars) return <p>No data available</p>

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
                        {cars.message.map((car, i) => (
                            <li key={i}>
                                {car.sold ? (
                                    <>
                                        <span className={styles.car}>{car.brand} {car.model} <b className={styles.sku}>[SKU: {car.sku}]</b></span>
                                        <div>MYR {Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(car.price)}</div>
                                        <small className="date">{new Date(car.soldOn).toLocaleDateString()}</small><br />
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

export default Sales;
