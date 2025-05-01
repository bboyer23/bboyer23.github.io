public class CashRegister {


	static private int qty_purchased;
	private RetailItem obj1;

	public CashRegister(RetailItem obj1,int qty_purchased){

		if(qty_purchased > obj1.getUnitsOnHand()){

			System.out.println("Sorry we only have " + obj1.getUnitsOnHand() + " units");
			System.exit(1);
		} 

		this.obj1 = obj1;
		this.qty_purchased = qty_purchased;


	}

	public double getSubTotal(RetailItem obj1){

		return this.obj1.getPrice() * qty_purchased;

	}

	public double getTax(RetailItem obj1){

		return getSubTotal(this.obj1) * 0.06;
	}

	public double getTotal(){

		return getSubTotal(this.obj1) + getTax(this.obj1);
	}

	public int getQtyPurchased(){

		return this.qty_purchased;
	}

	public String toString(){

		return String.format("Subtotal: $%.2f\nSales Tax: $%.2f\nTotal: $%.2f",getSubTotal(this.obj1),getTax(this.obj1),getTotal());
		
	}
	


}