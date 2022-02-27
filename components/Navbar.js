import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    return ( 
        <div>
            <nav>
                <div className="logo">
                    <Image src="/logo.png" width={77} height={77} alt="car" />
                </div>
                <Link href="/"><a className="bold">Home</a></Link>
                <Link href="/inventory"><a className="bold">Inventory</a></Link>
                <Link href="/sales"><a className="bold">Sales</a></Link>
            </nav>
        </div>
    );
}
 
export default Navbar;
