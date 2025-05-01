/***
 *
 * Author: Benjamin A. Boyer
 * Date: 4/2/24
 * Purpose/Scope:
 *
 *      Create a CargoShip class to serve as 2nd child
 *
 *      1 constructor (w/ super to parent C)
 *      1 field
 *      1 accessor
 *      1 mutator
 *      1 overridden toString method
 *
 *
 *
 *
 */
public class CargoShip extends Ship {

        private int tonnage; // record max weight

        public CargoShip(String shipName,String year, int tonnage){

                super(shipName,year); // super call to parent
                this.tonnage = tonnage;
        }


        public int getTonnage() { // accessor
            return tonnage;
        }

        public void setTonnage(int tonnage) { // mutator

            this.tonnage = tonnage;
        }

        @Override
        public String toString() { // toString override
            //  to return ship's name and cargo capacity
            return "Cargo Ship name: " + getShip() + "\nCargo Capacity: " + getTonnage() + " tonnage";
        }
}
