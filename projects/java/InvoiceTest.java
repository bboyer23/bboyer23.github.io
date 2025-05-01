/**
 * 
 * 	Author: Benjamin Boyer
 * 	Date: February 21, 2024
 * 	Purpose / Scope:
 * 
 * 		Driver method / tester class / client class / tester for Invoice Class
 * 
 * 		Unique Characters:
 * 
 * 			$ - Formatting
 * 			! - Object
 * 
 * */
public class InvoiceTest {
	
	public static void main(String[] args){


			Invoice bill_1 = new Invoice("1234","Hammer",2,14.95); // !

			System.out.println("Original Invoice Information\n" + bill_1);

			bill_1.setPartNumber("0523523");
			bill_1.setPartDescription("BIG HAMMER");
			bill_1.setQtyPurchased(10000);
			bill_1.setPricePerItem(500.27);

			
			System.out.println(); // $
			

			System.out.println("Updated Invoice Information:\n" + bill_1);

			
			System.out.println(); // $

			Invoice bill_2 = new Invoice("4052","Nail Set",5,2.99); // !

			System.out.println("Original Invoice Information\n" + bill_2);

			bill_2.setPartNumber("23550");
			bill_2.setPartDescription("Better Nails");
			bill_2.setQtyPurchased(3457);
			bill_2.setPricePerItem(10.99);


				System.out.println(); // $
			

			System.out.println("Updated Invoice Information:\n" + bill_2);
	}
}