/***
 * Author: Benjamin A. Boyer
 * Date: 4/2/24
 * Purpose/Scope:
 *      Create a Client class to serve as test
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
public class TestShip {

    public static void main(String[] args){

        Ship s1 = new Ship("The Duck","1967"); // parent object
        CruiseShip c1 = new CruiseShip("Yannis","2002",500); // child object
        CargoShip carrier1 = new CargoShip("The Transporter","2008",1200); // child object

        System.out.println(s1); // toStrings to display corresponding info
        System.out.println(c1);
        System.out.println(carrier1);


    }
}
