/***
 *
 * Author: Benjamin A. Boyer
 * Date: 4/2/24
 * Purpose/Scope:
 *
 *      Create a CruiseShip class to serve as 1st child
 *
 *      1 constructor (w/ super to parent C)
 *      1 fields
 *      1 accessor
 *      1 mutator
 *      1 overridden toString method
 *
 *
 *
 *
 */
public class CruiseShip extends Ship {

   private int max_pass; // store max passengers

    public CruiseShip(String shipName,String year,int max_pass){ // overloaded constructor

        super(shipName,year);
        this.max_pass = max_pass;
    }

    public int getMax_pass() { // accessor
        return max_pass;
    }

    public void setMax_pass(int max_pass) { // mutator
        this.max_pass = max_pass;
    }

    @Override
    public String toString() {
        return "Cruise Ship name: " + super.getShip() + "\nMaximum Passengers: " + getMax_pass();
    }
}
