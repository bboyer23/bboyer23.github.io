/*
Author: Benjamin Boyer
Date: 11/30/23
Purpose/Scope:

	Write a program that prompts the user for a month number and prints the corresponding
	month. 

	Use a switch statement (for selection). 

	Assume the month number for January is 1, February is 2, and so on.





*/

import java.util.*; // import util library

public class r3 { 

	public static void main(String[] args){


		// declare variables

		int month = 0, // start month count
			usr;
		Scanner scn = new Scanner(System.in); // create Scanner object

		System.out.println("Number 1-12 month in chronological order : ");

		usr = scn.nextInt(); // read in user input to determine month

		// switch selection statement
		switch(usr){

		case 1:

			System.out.println("January");

			break;

		case 2:

			System.out.println("February");

			break;

		case 3:

			System.out.println("March");

			break;

		case 4:

			System.out.println("April");

			break;

		case 5:

			System.out.println("May");

			break;

		case 6:

			System.out.println("June");

			break;

		case 7: 

			System.out.println("July");

			break;

		case 8:

			System.out.println("August");

			break;

		case 9:

			System.out.println("September");

			break;

		case 10:

			System.out.println("October");

			break;

		case 11:

			System.out.println("November");

			break;

		case 12:

			System.out.println("December");

			break;



		}







	}
}