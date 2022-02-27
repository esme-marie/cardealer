import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import Router from "next/router";

const Inventory = () => {
    const [cars, setCars] = useState(null)
    const [isLoading, setLoading] = useState(false)

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

    // Delete car
    const deleteCar = async (carId) => {
        try {
            // Delete car
            await fetch('/api/cars', {
                method: 'DELETE',
                body: carId,
            });

            // reload the page to load new info
            Router.reload() 

        } catch (error) {
            console.log(error);
        }
    };

    if (cars) {
        const inventory = cars.message.map((car) => {
            let stock = {}
            if (car.sold === false) {
                stock["id"] = car._id;
                stock["price"] = car.price
            } else {
                stock["id"] = car._id;
                stock["price"] = ""
            }
            return stock;
        });
        const balance = inventory.filter(stock => stock.price)
        console.log('balance: ', balance)
    }
    
    if (isLoading) return <p>Loading...</p>
    if (!cars) return <p>No data available</p>

    return (
        <>
            <div>
                <h1 className="header">Inventory</h1>
            </div>
            <div>
                <Link href="/add-inventory">
                    <a className={styles.addInventory}>Add Inventory</a>
                </Link>
            </div>
            <div className={styles.container}>
                {cars.length === 0 || balance.length === 0 ? (
                    <h2 className="center">No stock in hand.</h2>
                ) : (
                    <ul className="noBullets">
                        {cars.message.map((car, i) => (
                            <li key={i}>
                                {!car.sold ? (
                                    <>
                                        <span className={styles.car}>{car.brand} {car.model} <b className={styles.sku}>[SKU: {car.sku}]</b></span>
                                        <div>MYR {Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(car.price)}</div>
                                        <small className="date">{new Date(car.addedOn).toLocaleDateString()}</small><br />
                                        <button className={styles.delete} type="button" onClick={() => deleteCar(car['_id'])}>Delete</button>
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

export default Inventory;
