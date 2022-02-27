import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Inventory = ({ cars }) => {
    console.log('cars: ', cars)
    const router = useRouter();

    // Delete car
    const deleteCar = async (carId) => {
        try {
            // Delete car
            await fetch('/api/cars', {
                method: 'DELETE',
                body: carId,
            });

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            console.log(error);
        }
    };

    const inventory = cars.map((car) => {
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
                        {cars.map((car, i) => (
                            <li key={i}>
                                {!car.sold ? (
                                    <>
                                        <span className={styles.car}>{car.brand} {car.model} <b className={styles.sku}>[SKU: {car.sku}]</b></span>
                                        <div>MYR {Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(car.price)}</div>
                                        <small className="date">{new Date(car.addedOn).toLocaleDateString()}</small><br/>
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
 
export default Inventory;
