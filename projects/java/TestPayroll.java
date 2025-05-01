import java.util.Scanner;

public class TestPayroll{
	
	public static void main(String[] args){

		Payroll employee1 = new Payroll("John",123456);

		Scanner scn = new Scanner(System.in);

		System.out.println("Please enter the hours worked: ");
		employee1.setHours_Worked(scn.nextInt());
		System.out.println("Please enter the rate of pay: ");
		employee1.setPay_Rate(scn.nextDouble());

		System.out.printf("Gross pay is: %.2f",employee1.calculate_pay(employee1.getHours_Worked(),employee1.getPay_Rate()));

	}
}