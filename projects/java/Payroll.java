public class Payroll {
	
	private String name;
	private int identification;
	private double pay_rate;
	private int hours_worked;

	public Payroll(String name,int identification){

		this.name = name;
		this.identification = identification;
	}

	public String getName(){

		return this.name;
	}

	public int getIdentification(){

		return this.identification;
	}

	public double getPay_Rate(){

		return this.pay_rate;
	}

	public int getHours_Worked(){

		return this.hours_worked;
	}

	public void setName(String name){

		this.name = name;
	}

	public void setIdentification(int identification){

		this.identification = identification;
	}

	public void setPay_Rate(double pay_rate){

		this.pay_rate = pay_rate;
	}

	public void setHours_Worked(int hours_worked){

		this.hours_worked = hours_worked;
	}

	public double calculate_pay(int hours_worked,double pay_rate){

		double pay = this.hours_worked * this.pay_rate;

		return pay;
	}


}