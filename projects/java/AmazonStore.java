/****
 * 
 * 	Name: Benjamin Boyer
 * 	Date: March 28th, 2024
 * 	
 * 	Purpose: Midterm exam 
 * 
 * 
 * 
 * 
 * */
import java.util.*;
public class AmazonStore {
	
	// two private data members
	// type double for storing the price of items
	// make the two members static 
	// initialize the values to your choice

	private static double price_boots = 40.25;
	private static double price_boots_with_fur = 11.99;

	Scanner scn = new Scanner(System.in);

	// public instance method named showProducts with no params and no return type (void)

	public void showProducts(){

		System.out.println("Welcome to the Amazon Store!!!\nEverything is awesome here.\n(especially the boots)");
		System.out.printf("Items for sale:\nBoots\nBoots (With the fur)");
	}

	// public instance method named processOrder (no params no return type) ask user for choice, compute the cost. print the cost

	public void processOrder(){

		System.out.println("\nEnter 1 to buy Boots (no Fur)\n2 to buy Boots (with the fur)\n3 to buy both");
		int x = scn.nextInt();


		if(x == 1){

			System.out.println("Your order cost is: " + price_boots);

		} else if(x == 2){

			System.out.println("Your order cost is: " + price_boots_with_fur);


		} else if(x == 3){

			System.out.println("Your order cost is: " + (price_boots + price_boots_with_fur));


		} else {

			System.out.println("Error 404: Boots not found :(");


		}


	}
}