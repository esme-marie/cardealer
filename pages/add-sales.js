import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const AddSales = ({ cars }) => {
    const [cars, setCars] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const router = useRouter()
    const selectOptions = []

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
        const options = cars.message.map((car) => {
            let stock = {}
            if (car.sold === false) {
                stock["value"] = car._id;
                stock["label"] = car.brand + ' ' + car.model + ' ' + '[' + car.sku + ']' + ' MYR' + Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(car.price)
            } else {
                stock["value"] = car._id;
                stock["label"] = ""
            }
            return stock;
        });
        selectOptions = options.filter(stock => stock.label)
        console.log('options: ', options)
        console.log('selectOptions: ', selectOptions)
    }

    // Add sales
    const handleSales = async (carId) => {

        try {
            // Update sold
            await fetch('/api/cars', {
                method: 'PUT',
                body: carId
            });
            
            // re-direct page to /sales
            return router.push('/sales');
        } catch (error) {
            // Stop sold state
            console.log(error)
        }
    };

    if (isLoading) return <p>Loading...</p>
    if (!cars) return <p>No data available</p>

    return (
        <>
            <div>
                <h1 className="header">Add Sales Form</h1>
            </div>
            <div className={styles.container}>
                <Select options={selectOptions} value={value} onChange={(value) => setValue(value)} placeholder="Select a car" />
                <div className={styles.buttons}>
                    <Link href="/sales"><button className={styles.cancel}>Cancel</button></Link>
                    <button className={styles.sold} onClick={() => handleSales(value.value)}>Sold</button>
                </div>
            </div>
            
        </>
        
    );
}

// export async function getServerSideProps(ctx) {
//     // // get the current environment
//     // let dev = process.env.NODE_ENV !== 'production';
//     // let { DEV_URL, PROD_URL } = process.env;

//     // // request cars from api
//     // let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/cars`);

//     // // extract the data
//     // let data = await response.json();

//     // console.log('data: ', data)

//     let { db } = await connectToDatabase();
//     // fetch the cars
//     let cars = await db
//         .collection('cars')
//         .find({})
//         .sort({ addedOn: -1 })
//         .toArray();

//     return {
//         props: {
//             cars: JSON.parse(JSON.stringify(cars)),
//         },
//     };
// };
 
export default AddSales;
