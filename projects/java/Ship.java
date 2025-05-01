/***
 *
 * Author: Benjamin A. Boyer
 * Date: 4/2/24
 * Purpose/Scope:
 *
 *      Create a ship class to serve as parent class
 *
 *      2 constructors
 *      2 fields
 *      2 accessors
 *      2 mutators
 *      1 overridden toString method
 *
 *
 *
 *
 */
public class Ship {

    private String shipName; // String to store ship name
    private String year; // String to store year ship created

    public Ship(){ // default constructor

        shipName = "N/A";
        year = "N/A";

    }

    public Ship(String shipName, String year){ // overloaded constructor

        this.shipName = shipName;
        this.year = year;
    }

    public void setShip(String ship){ // mutator

        this.shipName = shipName;
    }

    public void setYear(String year){ // mutator

        this.year = year;

    }

    public String getShip(){ // accessor

        return shipName;

    }

    public String getYear(){ // accessor

        return year;
    }

    @Override
    public String toString(){ // override toString

        return "Ship name: " + getShip() + "\nDate Created: " + getYear();
    }



}
