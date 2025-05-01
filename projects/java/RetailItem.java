public class RetailItem {
	
	private String description;
    private int unitsOnHand;
	private double price;

	public RetailItem(String description, int unitsOnHand, double price){

		this.description = description;
		this.unitsOnHand = unitsOnHand;
		this.price = price;
	}

	public void setDescription(){

		this.description = description;
	}

	public void setUnitsOnHand(){

		this.unitsOnHand = unitsOnHand;
	}

	public void setPrice(){

		this.price = price;
	}

	public String getDescription(){

		return this.description;
	}

	public int getUnitsOnHand(){

		return this.unitsOnHand;
	}

	public double getPrice(){

		return this.price;
	}

	public String toString(){

		return String.format("Item Being Purchased: %s\nUnits On Hand: %d\nPrice: $%.2f",getDescription(),getUnitsOnHand(),getPrice());
	}

}