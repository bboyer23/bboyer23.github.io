import java.util.*;
public class TestPurchase {
	
	public static void main(String[] args){


			Scanner scn = new Scanner(System.in);

			RetailItem banana = new RetailItem("Banana",10,.50);
			System.out.println(banana);

			System.out.println("How many bananas are you buying?");
			CashRegister reg1 = new CashRegister(banana,scn.nextInt());



			int qty = reg1.getQtyPurchased();
			System.out.println(reg1);
			System.out.printf("Units on hand:%d\n",banana.getUnitsOnHand() - qty);


	}
}