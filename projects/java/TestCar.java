public class TestCar {
	
	public static void main(String[] args){

		Car car = new Car(2012,"Toyota Tacoma");

		System.out.println(car.getSpeed());

		for(int i = 0; i < 5; i++){

		car.accelerate();

		}

		System.out.println(car.getSpeed());

	}
}