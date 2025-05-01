/*

Author: Benjamin Boyer
Date: 11/30/23
Purpose / Scope: 


*/
import java.util.Scanner; // import scanner object

public class r1 {
	
	public static void main(String[] args){


		// declare variables
		int usr_input,
			counter = 1,
			factorial = 1;


		// make a program that creates factorials 

		Scanner scn = new Scanner(System.in); // create scanner obj

		// prompt user to enter a number greater than 0

		System.out.println("Please enter a number > 0: ");
		usr_input = scn.nextInt(); // read in user input


		// create logic structure for the factorial calculation
		// factorials n = n * (n-1) * (n-2) * (n-3)...

		while(usr_input >= counter ){ // usr_input is sentinel ; while >= 1; ! = 1 * 1, ++, 2

			// this works because it is holding the value of the factorial in memory while 
			// continously updates the value of counter to be multiplied against the new updated value of factorial

			factorial = counter * factorial;
			counter++;


		}

		System.out.println(factorial);

	}

}