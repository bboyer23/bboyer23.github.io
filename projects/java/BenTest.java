import java.util.*;

public class BenTest {

	public static void main(String[] args){



			Scanner scn = new Scanner(System.in);

			System.out.println("Hello World! Enter a numbers: ");

			int x = scn.nextInt();

			int y = scn.nextInt();

			int z = x + y;

			int count = 0;

			for(int i = 1; i < z; i++){

				count++;
				
			}

			System.out.println(z / count);
	}
}