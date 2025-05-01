/***
 * 
 * 	Author: Benjamin A. Boyer
 * 	Date: 4/29/24
 * 	Purpose/Scope:
 * 
 * 		Enter a check amount from user input and display in secure check format
 * 
 * */

import java.util.*;
public class Check {
	
	public static void main(String[] args){

		// scanner object

		Scanner scn = new Scanner(System.in);

		// prompting the user for amount

		System.out.println("Enter check amount: ");

		// reading and storing the input inside the scanner object

		String checkAmount = scn.nextLine();

		// validation check to make sure user is not entering more than 9 characters

		if(checkAmount.length() > 9){

			// throw error

			System.out.println("Error. Invalid Amount");
			return; // end program due to critical error
		}

		System.out.println();

		// declare how many stars are potentially needed and subrtract that amount from the
		// character length of the string storing the check amount
		int starsNeeded = 9 - checkAmount.length();

		// create a stringbuilder object to store the adjusted amount as we cannot edit strings directly
		// java creates references to objects and classes not physical locations
		StringBuilder adjustedAmount = new StringBuilder();

		// create an iterative loop to append stars for the amount calculated by stars needed variable

		for(int i = 0; i < starsNeeded; i++){

				// pre-append stars up until 9 character length limit
				adjustedAmount.append("*");
				
		}

		// append the check amount onto the adjustedAmount string builder object

		adjustedAmount.append(checkAmount);

		// declare an account number

		String accountNumber = "123125125";

		// display the new amount over the account number in secure format

		System.out.println(adjustedAmount + "\n---------\n" + accountNumber);



	}
}