import java.util.*;

public class StudentTest {
	
	public static void main(String[] args){

		Scanner scn = new Scanner(System.in);
		Student[] students = new Student[3];

		for(int i = 0; i < 3 ; i++){
			System.out.println("Enter your ID: ");
			int id = scn.nextInt();

			System.out.println("Enter # of Course Registered: ");
			int courses_registered = scn.nextInt();

			scn.nextLine(); // clear buffer

			System.out.println("Enter your name: ");
			String name = scn.nextLine();

			System.out.println("Enter your Phone #: ");
			String telephone_no = scn.nextLine();

			students[i]= new Student(id,courses_registered,name,telephone_no);
		}

		for(int i = 0; i < students.length; i++){
			students[i].printInfo();
		}
	}
}
