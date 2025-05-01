/*
An online retailer sells five products whose retail prices are as follows: Product 1, $2.98;
product 2, $4.50; product 3, $9.98; product 4, $4.49 and product 5, $6.87. Write an
application that reads a series of pairs of numbers as follows:
a) product number
b) quantity sold

Your program should use a switch statement to determine the retail price for each product.It
should calculate and display the total retail value of all products sold. Use a sentinel-
controlled loop to determine when the program should stop looping and display the final
results. Below is an example output.


*/



import java.util.*;

public class r6 {
	
	public static void main(String[] args){

		int product_id, // 1-5
			qty_sold; // amt sold
			
		double price,
			   total=0;


		Scanner scn = new Scanner(System.in);

		do{

		System.out.println("Enter the product ID (or enter 0 to stop for both entries): ");

		product_id = scn.nextInt(); // read in user input


		System.out.println("Enter the quantity sold: ");

		qty_sold = scn.nextInt(); // read in user input

		switch(product_id){

		case 1:
			price = 2.98;
			total = qty_sold * price;

			break;

		case 2:

			price = 4.50;
			total = qty_sold * price;

			break;

		case 3:

			price = 9.98;
			total = qty_sold * price;

			break;

		case 4:

			price = 4.49;
			total = qty_sold * price;

			break;


		case 5:

			price = 6.87;
			total = qty_sold * price;

			break;


		}

		if(product_id < 0 || product_id > 5 || qty_sold < 0){

			System.out.println("Please enter a valid entry");
		}


		} while(product_id != 0 || qty_sold != 0);

		System.out.println("The total amount sold is : "+total);



		// determine the retail price for each product

		// should calulate and display the total retail value of all products sold

		// use a sentinel controlled loop to exit the program




	}
}