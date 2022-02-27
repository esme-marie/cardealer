import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const AddInventory = () => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [sku, setSKU] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleCar = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // check fields
        if (!brand || !model || !sku || !price) return setError('All fields are required');

        // car structure
        let car = {
            brand,
            model,
            sku,
            price,
            sold: false,
            addedOn: new Date().toISOString(),
            soldOn: new Date().toISOString(),
        };

        // save the car
        let response = await fetch('/api/cars', {
            method: 'POST',
            body: JSON.stringify(car),
        });

        // get the data
        let data = await response.json();
        console.log('data: ', data)

        if (data.success) {
            // reset fields
            setBrand('');
            setModel('');
            setSKU('');
            setPrice(0.00);
            // set message
            return setMessage(data.message);
        } else {
            // set error
            return setError(data.message);
        }
    };

    return (
        <>
            <div>
                <h1 className="header">Add Inventory Form</h1>
            </div>
            <div className={styles.container}>
                <form onSubmit={handleCar} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label>Brand</label>
                        <input
                            type="text"
                            name="brand"
                            onChange={(e) => setBrand(e.target.value)}
                            value={brand}
                            placeholder="Car Brand" 
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Model</label>
                        <input
                            type="text"
                            name="model"
                            onChange={(e) => setModel(e.target.value)}
                            value={model}
                            placeholder="Car Model" 
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>SKU</label>
                        <input
                            type="text"
                            name="sku"
                            onChange={(e) => setSKU(e.target.value)}
                            value={sku}
                            placeholder="SKU" 
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            step=".01"
                            placeholder="Price" 
                        />
                    </div>
                    <div className={styles.buttons}>
                        <Link href="/inventory"><button className={styles.cancel}>Cancel</button></Link>
                        <button className={styles.addCar} type="submit">Add Car</button>
                    </div>
                </form>
            </div>
            <div>
                <p>SKU guide: BxxMxxCxxSxx</p>
                <p>xx: number from 01 | B: 1st letter in car brand | M: 1st letter in car model | C : 1st letter in car color | Sxx: stock number</p>           
                <p>example: Honda CRV (green): H01C01G01S01</p>
            </div>
        </>
        
    );
}
 
export default AddInventory;
