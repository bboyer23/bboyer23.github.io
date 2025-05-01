/**
 * 
 * 		Author: Benjamin Boyer
 * 		Date: February 21, 2024
 * 		Purpose/Scope:
 * 
 * 			Create a class called invoice for a hardware store
 * 
 * 			Invoice should include four pieces of information:
 * 
 * 				AS INSTANCE VARIABLES (class declared not driver method declared)
 * 
 * 				Part Number (String)
 * 				Part Description (String)
 * 				Quantity to be Purchased (int)
 * 				Price / item (double)
 * 
 * 
 * 
 * */

public class Invoice {

	// declare instance variables
	// we declare the variables as private as we do not want these data points to be accessed from the class without an object of this class

	private String partNumber;
	private String partDescription;
	private int qtyPurchased;
	private double pricePerItem;
	
	// we create a constructor method to initalize the instance variables and to validate their values 

	public Invoice(String partNumber,String partDescription,int qtyPurchased,double pricePerItem){

		this.partDescription = partDescription;
		this.partNumber = partNumber;
		
		// we use excessive validation logic here, while we could just call the setter methods here for simplicity per instruction and good practice we will not do this

		if(pricePerItem < 0.0){

			this.pricePerItem = 0;
		} else{

			this.pricePerItem = pricePerItem;
		}

		if(qtyPurchased < 0){

			this.qtyPurchased = 0;

		} else {

			this.qtyPurchased = qtyPurchased;
		}
		

	}

	/**
	 * 
	 *  @param partNumber
	 * 
	 * 	Set partNumber value
	 * 
	 * */

	public void setPartNumber(String partNumber){

		this.partNumber = partNumber;
	}

	/**
	 * 
	 *  @param partDescription
	 * 
	 * 	Set partDescription sentence
	 * 
	 * */

	public void setPartDescription(String partDescription){

		this.partDescription = partDescription;
	}

	/**
	 * 
	 *  @param qtyPurchased
	 * 
	 * 	Set Quantity purchased 
	 * 
	 * */

	public void setQtyPurchased(int qtyPurchased){

		if(qtyPurchased < 0){

			this.qtyPurchased = 0;

		} else {

			this.qtyPurchased = qtyPurchased;
		}

	}

	/**
	 * 
	 *  @param pricePerItem
	 * 
	 * 	Set price per item
	 * 
	 * */

	public void setPricePerItem(double pricePerItem){

		if(pricePerItem < 0.0){

			this.pricePerItem = 0.0;
		} else{

			this.pricePerItem = pricePerItem;
		}

	}

	/**
	 * 
	 * BEGIN THE GET STATEMENTS
	 * 
	 * */



	public double getPricePerItem(){

		return this.pricePerItem;
	}



	public int getQtyPurchased(){

		return this.qtyPurchased;
	}

	public String getPartDescription(){

		return this.partDescription;
	}

	public String getPartNumber(){

		return this.partNumber;
	}

	/**
	 * 
	 *  method for the full calculation 
	 * 
	 * */

	 public double getInvoiceAmount(){

	 	double invoiceAmount = this.qtyPurchased * this.pricePerItem;

	 	return invoiceAmount;
	 }

	 public String toString() {
	    
	    // return the formatted string
	    return String.format(
	        "Part Number: %s\n" +
	        "Description: %s\n" +
	        "Quantity: %d\n" +
	        "Price: %.2f\n" +
	        "Invoice Amount: %.2f",
	        partNumber, partDescription, qtyPurchased, pricePerItem, getInvoiceAmount()
	    );
}



}